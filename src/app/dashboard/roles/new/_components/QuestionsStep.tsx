import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  IconSearch,
  IconPlus,
  IconX,
  IconSparkles,
  IconChevronLeft,
  IconAlertCircle,
  IconFileText,
  IconCheck,
  IconLoader2,
} from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { StepIndicator } from "./add-role-stepper"
import { QuestionLevelTabs } from "./QuestionLevelTabs"
import { QuestionCard } from "./QuestionCard"
import { Accordion } from "@/components/ui/accordion"
import { AddQuestionDialog } from "./AddQuestionDialog"
import { EditQuestionDialog } from "./EditQuestionDialog"

import { 
  useGetJobProfileQuestions, 
  useGenerateQuestions, 
  useAddJobProfileQuestion, 
  useUpdateJobProfileQuestion, 
  useDeleteJobProfileQuestion, 
  useRegenerateJobProfileQuestion 
} from "@/lib/api/hooks/analytics/useJobProfiles"
import { useRef } from "react"

export function QuestionsStep() {
  const router = useRouter()

  // Load draft profile ID from local storage
  let profileId = typeof window !== "undefined" ? localStorage.getItem("samvaad_saathi_draft_profile_id") : null

  // API Hooks
  const { questionsData, isLoadingQuestions, refetch } = useGetJobProfileQuestions(profileId)
  const { generateQuestionsAsync, isGenerating } = useGenerateQuestions(profileId)
  const { addQuestionAsync } = useAddJobProfileQuestion(profileId)
  const { updateQuestionAsync } = useUpdateJobProfileQuestion(profileId)
  const { deleteQuestionAsync } = useDeleteJobProfileQuestion(profileId)
  const { regenerateQuestionAsync } = useRegenerateJobProfileQuestion(profileId)

  // Map API questions to UI model
  const apiQuestions = questionsData?.questions || []
  const questions = apiQuestions.map(q => ({
    id: String(q.question_id || q.questionId || ""),
    level: q.level,
    category: q.type,
    difficulty: q.difficulty,
    text: q.question,
    isAiGenerated: q.is_ai_generated ?? q.isAiGenerated,
    keywords: q.keywords || [],
    concepts: (q.concepts_covered ?? q.conceptsCovered) || [],
    expectedAnswer: (q.expected_answer ?? q.expectedAnswer) || "",
    exampleOutput: (q.example_output ?? q.exampleOutput) || ""
  }))

  const getQuestionDetails = (qText: string) => {
    // If the API provided keywords, use them, otherwise fallback to generic
    const targetQ = questions.find(q => q.text === qText)
    if (targetQ && (targetQ.keywords?.length > 0 || targetQ.concepts?.length > 0)) {
      return {
        keywords: targetQ.keywords,
        concepts: targetQ.concepts,
        expectedAnswer: targetQ.expectedAnswer,
        exampleOutput: targetQ.exampleOutput
      }
    }
    return {
      keywords: [],
      concepts: [],
      expectedAnswer: "No expected answer provided.",
      exampleOutput: ""
    }
  }

  // Load difficulty levels from localStorage or fallback to default
  const [difficultyLevels, setDifficultyLevels] = useState(() => {
    if (typeof window !== "undefined") {
      const savedLevels = localStorage.getItem("samvaad_saathi_difficulty_levels")
      if (savedLevels) {
        try {
          const parsed = JSON.parse(savedLevels)
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed
          }
        } catch (e) {
          console.error(e)
        }
      }
    }
    return [
      { level: 1, selected: true, count: 15, badgeLabel: "Foundational", title: "General Fundamentals" },
      { level: 2, selected: true, count: 15, badgeLabel: "Intermediate", title: "Project & Resume Based" },
      { level: 3, selected: true, count: 10, badgeLabel: "Advanced", title: "Production & Scenario Based" },
      { level: 4, selected: true, count: 10, badgeLabel: "Expert", title: "Advanced / Pressure Scenarios" }
    ]
  })

  const [activeTab, setActiveTab] = useState<number>(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [draftTitle, setDraftTitle] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("samvaad_saathi_draft_role")
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          if (parsed.jobName) {
            return `${parsed.jobName} - ${parsed.companyName || "Engineering"}`
          }
        } catch (e) {
          console.error(e)
        }
      }
    }
    return "New Role Draft"
  })

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [activeQuestion, setActiveQuestion] = useState<any>(null)
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null)

  // Floating Toast state
  const [showToast, setShowToast] = useState(true)
  const hasGeneratedRef = useRef(false)



  const activeLevels = difficultyLevels.filter(l => l.selected)
  const totalQuestions = activeLevels.reduce((acc, curr) => acc + curr.count, 0)
  
  // Try to generate questions automatically if we have 0 questions from API
  useEffect(() => {
    const fetchedTotal = questionsData?.total_questions ?? questionsData?.totalQuestions
    if (profileId && questionsData && fetchedTotal === 0 && !isGenerating && !hasGeneratedRef.current) {
       hasGeneratedRef.current = true;
       const levelsPayload = difficultyLevels.map(l => ({
          level: l.level,
          count: l.selected ? l.count : 0
       }))
       
       let knowledgeReferenceContext = undefined;
       if (typeof window !== "undefined") {
         const k = localStorage.getItem("samvaad_saathi_knowledge_questions");
         if (k) {
            try {
              const parsed = JSON.parse(k);
              knowledgeReferenceContext = parsed.extractedText || JSON.stringify(parsed.topics);
            } catch (e) {
             knowledgeReferenceContext = k;
           }
         }
       }

       if (levelsPayload.some(l => l.count > 0)) {
         const loadingToast = toast.loading("Generating AI questions based on provided reference...")
         generateQuestionsAsync({ 
             levels: levelsPayload,
             knowledge_reference_context: knowledgeReferenceContext
         })
           .then(() => {
             toast.dismiss(loadingToast)
             toast.success("Questions generated successfully!")
             refetch()
           })
           .catch(err => {
             console.error("Error generating questions:", err)
             toast.dismiss(loadingToast)
             toast.error(err?.response?.data?.detail || "Failed to generate questions")
           })
       }
    }
  }, [profileId, questionsData, difficultyLevels, isGenerating, generateQuestionsAsync, refetch])

  useEffect(() => {
    if (activeLevels.length > 0 && !activeLevels.some(l => l.level === activeTab)) {
      setActiveTab(activeLevels[0].level)
    }
  }, [difficultyLevels, activeTab, activeLevels])

  // Set the first question of the current level expanded by default on tab change
  useEffect(() => {
    const firstOfLevel = questions.find(q => q.level === activeTab)
    if (firstOfLevel) {
      setExpandedQuestionId(firstOfLevel.id)
    } else {
      setExpandedQuestionId(null)
    }
  }, [activeTab, questionsData])

  // Modals input fields
  const [modalText, setModalText] = useState("")
  const [modalCategory, setModalCategory] = useState("THEORETICAL")
  const [modalDifficulty, setModalDifficulty] = useState("MEDIUM")

  // Filtered Questions
  const filteredQuestions = questions.filter((q) => {
    const matchesLevel = q.level === activeTab
    const matchesSearch = q.text.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesLevel && matchesSearch
  })

  // Dynamic actions mapped to backend APIs
  const handleDelete = async (id: string) => {
    try {
      await deleteQuestionAsync({ questionId: id })
      toast.success("Question deleted successfully")
      refetch()
    } catch {
      toast.error("Failed to delete question")
    }
  }

  const handleOpenEdit = (q: any) => {
    setActiveQuestion(q)
    setModalText(q.text)
    setModalCategory(q.category)
    setModalDifficulty(q.difficulty)
    setIsEditOpen(true)
  }

  const handleSaveEdit = async () => {
    if (!modalText.trim() || !activeQuestion) return
    try {
      await updateQuestionAsync({
        questionId: activeQuestion.id,
        question: modalText,
        type: modalCategory,
        difficulty: modalDifficulty
      })
      setIsEditOpen(false)
      toast.success("Question updated successfully")
      refetch()
    } catch {
      toast.error("Failed to update question")
    }
  }

  const handleOpenAdd = () => {
    setModalText("")
    setModalCategory("THEORETICAL")
    setModalDifficulty("EASY")
    setIsAddOpen(true)
  }

  const handleAddQuestion = async () => {
    if (!modalText.trim()) return
    try {
      await addQuestionAsync({
        question: modalText,
        level: activeTab,
        difficulty: modalDifficulty,
        type: modalCategory,
        is_ai_generated: false
      })
      setIsAddOpen(false)
      toast.success("New question added successfully")
      refetch()
    } catch {
      toast.error("Failed to add question")
    }
  }

  const handleRegenerate = async (id: string) => {
    try {
      await regenerateQuestionAsync({ questionId: id })
      toast.success("Question regenerated by AI successfully")
      refetch()
    } catch {
      toast.error("Failed to regenerate question")
    }
  }

  const handleSaveDraft = () => {
    if (typeof window !== "undefined") {
      let draftProfileId = localStorage.getItem("samvaad_saathi_draft_profile_id");
      if (draftProfileId && draftProfileId !== "null") {
        localStorage.setItem(`samvaad_saathi_draft_step_${draftProfileId}`, "4");
      }
    }
    toast.success("Draft saved successfully")
    router.push("/dashboard/roles")
  }

  const [isMounted, setIsMounted] = useState(false)
  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <div className="flex flex-col gap-5 py-4 px-4 lg:px-6 relative min-h-[calc(100vh-100px)]">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mb-1 select-none">
            <span>Roles Analytics</span>
            <span>/</span>
            <span className="text-slate-400">New role</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">
            Create a new interview role
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold rounded-lg px-4 py-2 h-9 text-xs transition-colors shadow-sm"
            onClick={handleSaveDraft}
          >
            Save draft
          </Button>
          <Button
            variant="ghost"
            className="hover:bg-slate-100 text-slate-600 font-semibold rounded-lg px-4 py-2 h-9 text-xs transition-colors"
            onClick={() => router.push("/dashboard/roles")}
          >
            Cancel
          </Button>
        </div>
      </div>

      {/* Stepper Display (Renders the exact 6-step stepper using the old design) */}
      <div className="border border-slate-200 rounded-2xl p-6 bg-white shadow-sm overflow-hidden select-none">
        <StepIndicator
          currentStep={4}
          onStepClick={(targetStep) => {
            if (targetStep === 4) {
              router.push("/dashboard/roles/new/questions")
            } else {
              router.push(`/dashboard/roles/new?step=${targetStep}`)
            }
          }}
        />
      </div>

      {/* Role Draft Card */}
      <Card className="border border-slate-200 rounded-xl shadow-sm bg-white overflow-hidden">
        <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <IconFileText className="size-6 text-blue-600" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Role draft</span>
                <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-none text-[10px] px-2 py-0">Draft</Badge>
              </div>
              <h2 className="text-base font-extrabold text-slate-800 mt-0.5">
                {draftTitle}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-[#EFF6FF] border border-blue-100 rounded-lg px-3 py-1.5">
            <IconSparkles className="size-4 text-blue-600" />
            <span className="text-xs font-bold text-blue-700">{totalQuestions} questions generated</span>
          </div>
        </CardContent>
      </Card>

      {/* Level Tabs and Filter Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2 border-b border-slate-100 pb-3">
        <QuestionLevelTabs
          activeLevels={activeLevels}
          questions={questions}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {/* Right Side Actions / Search */}
        <div className="flex flex-wrap items-center gap-2 md:self-end">
          <div className="relative w-48 sm:w-56">
            <IconSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions..."
              className="w-full bg-white border border-slate-300 rounded-lg pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-sm"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <IconX className="size-3.5" />
              </button>
            )}
          </div>

          <Button
            variant="outline"
            className="border border-slate-300 hover:bg-slate-50 text-slate-600 text-xs font-semibold px-3 py-1.5 h-8 rounded-lg shadow-sm"
            onClick={() => toast.info(`Preview of all ${totalQuestions} questions is open!`)}
          >
            Preview all
          </Button>

          <Button
            onClick={handleOpenAdd}
            className="bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 h-8 rounded-lg shadow-sm flex items-center gap-1"
          >
            <IconPlus className="size-3.5" /> Add question
          </Button>
        </div>
      </div>

      {/* Dynamic Questions List */}
      <div className="space-y-3">
        {isGenerating ? (
          <div className="border border-dashed border-slate-200 rounded-xl p-12 text-center bg-white shadow-sm flex flex-col items-center">
            <IconLoader2 className="size-10 animate-spin text-blue-600 mb-3" />
            <h3 className="text-sm font-semibold text-slate-700">Generating AI Questions</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Please wait, this can take up to 2 minutes. The AI is crafting high-quality interview questions based on your JD and selected difficulty levels.
            </p>
          </div>
        ) : filteredQuestions.length === 0 ? (
          <div className="border border-dashed border-slate-200 rounded-xl p-12 text-center bg-white shadow-sm">
            <IconAlertCircle className="size-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-slate-700">No questions found</h3>
            <p className="text-xs text-slate-400 mt-1">Try modifying your search or add a custom question.</p>
          </div>
        ) : (
          <Accordion
            type="single"
            collapsible
            value={expandedQuestionId || ""}
            onValueChange={(val) => setExpandedQuestionId(val || null)}
            className="space-y-3 w-full"
          >
            {filteredQuestions.map((q, idx) => {
              const isExpanded = expandedQuestionId === q.id
              const details = getQuestionDetails(q.text)

              return (
                <QuestionCard
                  key={q.id}
                  question={q}
                  index={idx}
                  isExpanded={isExpanded}
                  onToggleExpand={() => setExpandedQuestionId(isExpanded ? null : q.id)}
                  onEdit={() => handleOpenEdit(q)}
                  onRegenerate={() => handleRegenerate(q.id)}
                  onDelete={() => handleDelete(q.id)}
                  details={details}
                />
              )
            })}
          </Accordion>
        )}
      </div>

      {/* Floating Bottom-Right Toast */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#EFF6FF] border border-blue-200 rounded-xl px-4 py-3 shadow-lg flex items-center gap-3 animate-in slide-in-from-bottom duration-300">
          <div className="flex items-center gap-2">
            <IconCheck className="size-4 text-blue-600" />
            <p className="text-xs font-extrabold text-blue-800">{questions.length > 0 ? `${questions.length} questions generated successfully` : 'Generating questions...'}</p>
          </div>
          <button
            onClick={() => setShowToast(false)}
            className="text-blue-400 hover:text-blue-600 transition-colors ml-2 cursor-pointer"
          >
            <IconX className="size-4" />
          </button>
        </div>
      )}

      {/* Footer Navigation bar */}
      <div className="flex items-center justify-between border-t border-slate-200 pt-4 mt-8">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/dashboard/roles/new?step=3")}
          className="border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold rounded-lg px-6 py-2.5 shadow-sm transition-colors duration-200 h-11 flex items-center gap-1.5"
        >
          <IconChevronLeft className="size-4" />
          Back
        </Button>

        <span className="text-xs font-bold text-slate-400 select-none hidden md:inline">
          Step 5 of 6
        </span>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold rounded-lg px-6 py-2.5 shadow-sm transition-colors duration-200 h-11"
            onClick={handleSaveDraft}
          >
            Save draft
          </Button>

          <Button
            className="bg-[#2563EB] hover:bg-blue-700 text-white font-semibold rounded-lg px-6 py-2.5 shadow-sm transition-colors duration-200 h-11 flex items-center gap-1.5"
            onClick={() => {
              toast.success("Role questions successfully reviewed!")
              router.push("/dashboard/roles/new?step=5")
            }}
          >
            Final review
            <IconCheck className="size-4" />
          </Button>
        </div>
      </div>

      {/* Add Question Modal */}
      <AddQuestionDialog
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        modalText={modalText}
        setModalText={setModalText}
        modalCategory={modalCategory}
        setModalCategory={setModalCategory}
        modalDifficulty={modalDifficulty}
        setModalDifficulty={setModalDifficulty}
        onAdd={handleAddQuestion}
      />

      {/* Edit Question Modal */}
      <EditQuestionDialog
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        modalText={modalText}
        setModalText={setModalText}
        modalCategory={modalCategory}
        setModalCategory={setModalCategory}
        modalDifficulty={modalDifficulty}
        setModalDifficulty={setModalDifficulty}
        onSave={handleSaveEdit}
      />
    </div>
  )
}
