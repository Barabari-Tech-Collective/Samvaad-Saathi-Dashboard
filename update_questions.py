import sys
import json

file_path = 'c:/Users/hp/OneDrive/Documents/samvaad-saathi-dashboard/Samvaad-Saathi-Dashboard/src/app/dashboard/roles/new/_components/QuestionsStep.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

idx1 = content.find('// 50 highly realistic Front-End questions distributed across 4 difficulty levels')
idx2 = content.find('  return (\n    <div className=\"flex flex-col gap-5')

if idx1 == -1 or idx2 == -1:
    print('Failed to find anchors!')
    sys.exit(1)

new_content = content[:idx1] + '''import { 
  useGetJobProfileQuestions, 
  useGenerateQuestions, 
  useAddJobProfileQuestion, 
  useUpdateJobProfileQuestion, 
  useDeleteJobProfileQuestion, 
  useRegenerateJobProfileQuestion 
} from \"@/lib/api/hooks/analytics/useJobProfiles\"
import { useRef } from \"react\"

export function QuestionsStep() {
  const router = useRouter()

  // Load draft profile ID from local storage
  let profileId = typeof window !== \"undefined\" ? localStorage.getItem(\"samvaad_saathi_draft_profile_id\") : null

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
    id: q.question_id || q.questionId,
    level: q.level,
    category: q.type,
    difficulty: q.difficulty,
    text: q.question,
    isAiGenerated: q.is_ai_generated ?? q.isAiGenerated,
    keywords: q.keywords || [],
    concepts: q.concepts_covered ?? q.conceptsCovered || [],
    expectedAnswer: q.expected_answer ?? q.expectedAnswer || \"\",
    exampleOutput: q.example_output ?? q.exampleOutput || \"\"
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
      keywords: [\"frontend\", \"best practices\", \"architecture\", \"optimization\"],
      concepts: [\"Core concepts\", \"Performance optimizations\", \"Maintainable architecture\"],
      expectedAnswer: \"A complete explanation addressing the core design, performance implications, and practical implementation details of the topic.\",
      exampleOutput: \"Code example illustrating the pattern in production.\"
    }
  }

  // Load difficulty levels from localStorage or fallback to default
  const [difficultyLevels, setDifficultyLevels] = useState([
    { level: 1, selected: true, count: 15, badgeLabel: \"Foundational\", title: \"General Fundamentals\" },
    { level: 2, selected: true, count: 15, badgeLabel: \"Intermediate\", title: \"Project & Resume Based\" },
    { level: 3, selected: true, count: 10, badgeLabel: \"Advanced\", title: \"Production & Scenario Based\" },
    { level: 4, selected: true, count: 10, badgeLabel: \"Expert\", title: \"Advanced / Pressure Scenarios\" }
  ])

  const [activeTab, setActiveTab] = useState<number>(1)
  const [searchQuery, setSearchQuery] = useState(\"\")
  const [draftTitle, setDraftTitle] = useState(\"Senior Front-End Developer - Engineering\")

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [activeQuestion, setActiveQuestion] = useState<any>(null)
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null)

  // Floating Toast state
  const [showToast, setShowToast] = useState(true)
  const hasGeneratedRef = useRef(false)

  useEffect(() => {
    if (typeof window !== \"undefined\") {
      const savedLevels = localStorage.getItem(\"samvaad_saathi_difficulty_levels\")
      if (savedLevels) {
        try {
          const parsed = JSON.parse(savedLevels)
          if (Array.isArray(parsed) && parsed.length > 0) {
            setDifficultyLevels(parsed)
          }
        } catch (e) {
          console.error(e)
        }
      }
      const saved = localStorage.getItem(\"samvaad_saathi_draft_role\")
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          if (parsed.jobName) {
            setDraftTitle(\\ - \\)
          }
        } catch (e) {
          console.error(e)
        }
      }
    }
  }, [])

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
       if (typeof window !== \"undefined\") {
         const k = localStorage.getItem(\"samvaad_saathi_knowledge_questions\");
         if (k) knowledgeReferenceContext = k;
       }

       if (levelsPayload.some(l => l.count > 0)) {
         const loadingToast = toast.loading(\"Generating AI questions based on provided reference...\")
         generateQuestionsAsync({ 
             levels: levelsPayload,
             knowledge_reference_context: knowledgeReferenceContext,
             ...({ knowledgeReferenceContext } as any)
         })
           .then(() => {
             toast.dismiss(loadingToast)
             toast.success(\"Questions generated successfully!\")
             refetch()
           })
           .catch(err => {
             toast.dismiss(loadingToast)
             toast.error(\"Failed to generate questions\")
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
  const [modalText, setModalText] = useState(\"\")
  const [modalCategory, setModalCategory] = useState(\"THEORETICAL\")
  const [modalDifficulty, setModalDifficulty] = useState(\"MEDIUM\")

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
      toast.success(\"Question deleted successfully\")
      refetch()
    } catch {
      toast.error(\"Failed to delete question\")
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
        data: {
          question: modalText,
          category: modalCategory,
          difficulty: modalDifficulty
        }
      })
      setIsEditOpen(false)
      toast.success(\"Question updated successfully\")
      refetch()
    } catch {
      toast.error(\"Failed to update question\")
    }
  }

  const handleOpenAdd = () => {
    setModalText(\"\")
    setModalCategory(\"THEORETICAL\")
    setModalDifficulty(\"EASY\")
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
      toast.success(\"New question added successfully\")
      refetch()
    } catch {
      toast.error(\"Failed to add question\")
    }
  }

  const handleRegenerate = async (id: string) => {
    try {
      await regenerateQuestionAsync({ questionId: id })
      toast.success(\"Question regenerated by AI successfully\")
      refetch()
    } catch {
      toast.error(\"Failed to regenerate question\")
    }
  }

''' + content[idx2:]

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(new_content)

print('Success')
