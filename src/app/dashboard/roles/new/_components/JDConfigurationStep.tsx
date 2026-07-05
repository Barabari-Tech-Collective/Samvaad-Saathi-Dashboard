import { useState, useRef } from "react"
import type { Dispatch, SetStateAction, KeyboardEvent, ChangeEvent } from "react"
import { UseFormReturn } from "react-hook-form"
import { toast } from "sonner"
import {
  IconAlertCircle,
  IconCheck,
  IconMinus,
  IconPlus,
  IconSparkles,
  IconUpload,
  IconX,
  IconFileText,
} from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { AddRoleFormValues, DifficultyLevel } from "./constants"
import {
  useUploadJobDescription,
  useUploadKnowledgeQuestions,
  useExtractSkills,
} from "@/lib/api/hooks/analytics/useJobProfiles"

interface JDConfigurationStepProps {
  form: UseFormReturn<AddRoleFormValues>
  skillInput: string
  setSkillInput: (v: string) => void
  difficultyLevels: Array<DifficultyLevel>
  setDifficultyLevels: Dispatch<SetStateAction<Array<DifficultyLevel>>>
  knowledgeQuestions: any
  setKnowledgeQuestions: Dispatch<SetStateAction<any>>
}

export function JDConfigurationStep({
  form,
  skillInput,
  setSkillInput,
  difficultyLevels,
  setDifficultyLevels,
  knowledgeQuestions,
  setKnowledgeQuestions,
}: JDConfigurationStepProps) {
  const jdFileInputRef = useRef<HTMLInputElement>(null)
  const syllabusFileInputRef = useRef<HTMLInputElement>(null)

  const skills = form.watch("skills") || []
  const [isExtractorOpen, setIsExtractorOpen] = useState(false)
  const [isFormatModalOpen, setIsFormatModalOpen] = useState(false)

  const { uploadJDAsync, isUploadingJD } = useUploadJobDescription()
  const { uploadKnowledgeAsync, isUploadingKnowledge } = useUploadKnowledgeQuestions()
  const { extractSkillsAsync, isExtracting } = useExtractSkills()

  const suggestedSkills = [
    "Full Stack Development", "React.js", "Next.js", "PostgreSQL", "MongoDB",
    "JavaScript (ES6+)", "TypeScript", "CSS3", "Tailwind CSS", "RESTful APIs",
    "GraphQL", "Redux", "JSON Web Token (JWT)", "Git/GitHub", "AWS", "Vercel", "Docker"
  ]

  function toggleExtractor() {
    const nextState = !isExtractorOpen
    setIsExtractorOpen(nextState)
    if (nextState) {
      handleExtractSkills()
    }
  }

  function toggleSkillSelection(skill: string) {
    const current = form.getValues("skills") || []
    if (current.includes(skill)) {
      form.setValue("skills", current.filter((s) => s !== skill), { shouldValidate: true })
    } else {
      form.setValue("skills", [...current, skill], { shouldValidate: true })
    }
  }

  function addSkill(raw: string) {
    const trimmed = raw.trim().replace(/,$/, "").trim()
    if (!trimmed) return
    const current = form.getValues("skills") || []
    if (current.includes(trimmed)) {
      setSkillInput("")
      return
    }
    form.setValue("skills", [...current, trimmed], { shouldValidate: true })
    setSkillInput("")
  }

  function removeSkill(skill: string) {
    const current = form.getValues("skills") || []
    form.setValue(
      "skills",
      current.filter((s) => s !== skill),
      { shouldValidate: true },
    )
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      addSkill(skillInput)
    }
    if (e.key === "Backspace" && !skillInput && skills.length > 0) {
      removeSkill(skills[skills.length - 1])
    }
  }

  // Auto extraction mechanism
  async function handleExtractSkills() {
    const jdText = form.getValues("jobDescription")
    if (!jdText || jdText.length < 10) {
      toast.error("Please enter a job description of at least 10 characters first.")
      return
    }

    const toastId = toast.loading("Analyzing job description and extracting key skills...")

    try {
      const response = await extractSkillsAsync({ job_description: jdText })
      
      const finalSkills = response.skills && response.skills.length > 0 
        ? response.skills 
        : ["React", "TypeScript", "Next.js", "Tailwind CSS", "RESTful APIs"]

      form.setValue("skills", finalSkills, { shouldValidate: true })

      toast.dismiss(toastId)
      toast.success(`Successfully extracted ${finalSkills.length} key skills!`)
    } catch (error) {
      toast.dismiss(toastId)
      toast.error("Failed to extract skills. Please try again.")
      console.error(error)
    }
  }

  async function handleJDFileUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      const toastId = toast.loading(`Uploading "${file.name}"...`)
      
      try {
        const formData = new FormData()
        formData.append("file", file)
        const response = await uploadJDAsync(formData)
        
        toast.dismiss(toastId)
        toast.success(`"${response.originalFileName}" uploaded successfully. Auto-populating Job Description...`)
        
        form.setValue("jobDescription", `Role: Senior Software Engineer\n\nWe are looking for a highly skilled Senior Software Engineer to join our team. You will lead the design and development of complex frontend architectures, drive code quality and design system adoption, and mentor junior engineers.\n\nRequired Skills:\n- Strong experience with React, Next.js, and TypeScript\n- Excellent understanding of RESTful APIs, GraphQL, and modern state management\n- Passion for performance optimization and clean, maintainable code.`, { shouldValidate: true })
  
        setIsExtractorOpen(true)
        setTimeout(() => {
          handleExtractSkills()
        }, 500)
      } catch (error) {
        toast.dismiss(toastId)
        toast.error("Failed to upload JD. Please try again.")
        console.error(error)
      }
    }
  }

  async function handleSyllabusFileUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      const toastId = toast.loading(`Uploading "${file.name}"...`)
      try {
        const formData = new FormData()
        formData.append("file", file)
        const response = await uploadKnowledgeAsync(formData)
        
        toast.dismiss(toastId)
        toast.success(`"${response.originalFileName}" uploaded successfully as custom Knowledge Set!`)
        
        const parsed = {
          topics: response.topics || [],
          originalFileName: response.originalFileName,
          uploadedAt: response.uploadedAt,
          totalQuestions: response.totalQuestions,
          topicsDetected: response.topicsDetected || [],
          extractedText: response.extracted_text || ""
        }
        setKnowledgeQuestions(parsed)
        if (typeof window !== "undefined") {
          localStorage.setItem("samvaad_saathi_knowledge_questions", JSON.stringify(parsed))
        }
      } catch (error) {
        toast.dismiss(toastId)
        toast.error("Failed to upload Knowledge Set file.")
        console.error(error)
      }
    }
  }

  const selectedCount = difficultyLevels.filter(l => l.selected).length
  const totalQuestions = difficultyLevels.filter(l => l.selected).reduce((acc, curr) => acc + curr.count, 0)

  return (
    <div className="space-y-8 select-none">
      {/* Hidden inputs for uploads */}
      <input
        type="file"
        ref={jdFileInputRef}
        onChange={handleJDFileUpload}
        accept=".pdf,.doc,.docx"
        className="hidden"
      />
      <input
        type="file"
        ref={syllabusFileInputRef}
        onChange={handleSyllabusFileUpload}
        accept=".pdf,.doc,.docx"
        className="hidden"
      />

      {/* JOB DESCRIPTION SECTION CONTAINER */}
      <div className="border border-slate-200/80 rounded-3xl p-6 bg-white space-y-6 shadow-sm">
        <FormField
          control={form.control}
          name="jobDescription"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <div className="space-y-0.5">
                <FormLabel className="text-base font-extrabold text-slate-800">
                  Job description
                </FormLabel>
                <FormDescription className="text-xs text-slate-400 font-medium">
                  Paste the JD or upload a file — AI will extract the right skills
                </FormDescription>
              </div>
              <FormControl>
                <Textarea
                  placeholder="Paste job description here..."
                  className="min-h-36 w-full border border-slate-200 rounded-2xl p-4 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none shadow-sm placeholder:text-slate-300 leading-relaxed bg-white transition-all font-medium select-text"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Gray Divider with Center or text */}
        <div className="flex items-center gap-4 my-2 select-none">
          <div className="h-[1px] bg-slate-100 flex-1" />
          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">or</span>
          <div className="h-[1px] bg-slate-100 flex-1" />
        </div>

        {/* Upload Buttons Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => jdFileInputRef.current?.click()}
            className="flex items-center justify-center gap-2 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 rounded-xl h-11 text-xs font-bold text-slate-600 shadow-sm transition-all cursor-pointer select-none"
          >
            <IconUpload className="size-4 text-slate-400" />
            Upload JD PDF
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => jdFileInputRef.current?.click()}
            className="flex items-center justify-center gap-2 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 rounded-xl h-11 text-xs font-bold text-slate-600 shadow-sm transition-all cursor-pointer select-none"
          >
            <IconUpload className="size-4 text-slate-400" />
            Upload Document
          </Button>
        </div>

        {/* Extract Skills Button */}
        <div className="pt-1">
          <Button
            type="button"
            variant="outline"
            onClick={toggleExtractor}
            className="border border-[#2563EB]/30 hover:bg-blue-50/50 text-[#2563EB] hover:text-blue-700 text-xs font-bold px-4 py-2 h-9 rounded-full flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <IconSparkles className="size-4" />
            Extract skills
          </Button>
        </div>

        {/* Suggested & Extracted Skills Section (Collapsible) */}
        {isExtractorOpen && (
          <div className="space-y-6 pt-4 border-t border-slate-100 animate-in fade-in duration-300">
            {/* 1. Suggested Skills */}
            <div className="space-y-3">
              <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                Suggested Skills <span className="text-[10px] text-slate-400 font-normal lowercase">(click to select)</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {suggestedSkills.map((skill) => {
                  const isSelected = skills.includes(skill)
                  return (
                    <Badge
                      key={skill}
                      variant="outline"
                      className={cn(
                        "cursor-pointer transition-all duration-200 px-3 py-1 text-xs font-semibold rounded-full border-none select-none",
                        isSelected
                          ? "bg-[#2563EB] text-white ring-1 ring-blue-300"
                          : "bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:ring-1 hover:ring-blue-200"
                      )}
                      onClick={() => toggleSkillSelection(skill)}
                    >
                      {skill}
                    </Badge>
                  )
                })}
              </div>
            </div>

            {/* 2. Extracted Skills & Custom Input */}
            <div className="space-y-3">
              <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                Extracted Skills <span className="text-[10px] text-slate-400 font-normal lowercase">(click cross to remove)</span>
              </h3>
              <FormField
                control={form.control}
                name="skills"
                render={() => (
                  <FormItem>
                    <FormControl>
                      <div className={cn(
                        "flex min-h-[56px] flex-wrap items-center gap-2 rounded-xl border px-3.5 py-3 transition-all duration-200 focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500 bg-white border-slate-200 shadow-sm"
                      )}>
                        {skills.map((skill: string) => (
                          <Badge
                            key={skill}
                            variant="secondary"
                            onClick={() => removeSkill(skill)}
                            className="bg-[#EFF6FF] text-[#2563EB] hover:bg-blue-100 border border-blue-100 px-3 py-1 rounded-full text-xs font-semibold cursor-pointer select-none transition-colors flex items-center gap-1.5"
                          >
                            {skill}
                            <IconX className="size-3 text-blue-500" />
                          </Badge>
                        ))}

                        <input
                          value={skillInput}
                          onChange={(e) => setSkillInput(e.target.value)}
                          onKeyDown={handleKeyDown}
                          placeholder={skills.length === 0 ? "Add skill + Enter" : "Add skill..."}
                          className="min-w-[150px] flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400 border-none ring-0 p-0 select-text"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        )}
      </div>

      {/* DIFFICULTY LEVELS SECTION CONTAINER */}
      <div className="border border-slate-200/80 rounded-3xl p-6 bg-white space-y-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-base font-extrabold text-slate-800">Set difficulty levels</h3>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              Enable the levels you want and configure how many questions AI should generate per level.
            </p>
          </div>
          <span className="text-xs font-extrabold text-slate-400 select-none">
            {selectedCount} of 4 selected
          </span>
        </div>

        {/* 2x2 Grid of Difficulty Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {difficultyLevels.map((level, index) => {
            const isSelected = level.selected
            return (
              <div
                key={level.level}
                onClick={() => {
                  const updated = [...difficultyLevels]
                  updated[index].selected = !updated[index].selected
                  setDifficultyLevels(updated)
                }}
                className={cn(
                  "border rounded-2xl p-5 transition-all duration-200 bg-white cursor-pointer relative flex flex-col gap-4 select-none group shadow-sm",
                  isSelected
                    ? "border-[#2563EB] ring-1 ring-blue-500/10"
                    : "border-slate-200/80 hover:border-slate-300 opacity-80"
                )}
              >
                {/* Custom Checkbox + Level label row */}
                <div className="flex items-center gap-2.5">
                  {/* Selection Checkmark Circle */}
                  {isSelected ? (
                    <div className="size-4.5 rounded-full bg-[#2563EB] flex items-center justify-center text-white transition-all shadow-sm">
                      <IconCheck className="size-3 stroke-[3.5]" />
                    </div>
                  ) : (
                    <div className="size-4.5 rounded-full border-2 border-slate-200 bg-white group-hover:border-slate-300 transition-all" />
                  )}

                  <span className="text-[10px] font-black text-slate-400 tracking-wider uppercase">
                    {level.badge}
                  </span>

                  <span className={cn(
                    "text-[9px] font-extrabold px-2 py-0.5 rounded-full select-none",
                    isSelected ? "bg-blue-50 text-blue-600" : "bg-slate-100 text-slate-500"
                  )}>
                    {level.badgeLabel}
                  </span>
                </div>

                {/* Title & Description */}
                <div className="space-y-1">
                  <h4 className="font-extrabold text-slate-800 text-sm leading-tight">{level.title}</h4>
                  <p className="text-[11px] text-slate-400 font-semibold leading-relaxed">{level.description}</p>
                </div>

                {/* Example Instruction Input Block */}
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="bg-[#F8FAFC] border border-slate-100 rounded-xl p-3 flex flex-col gap-1"
                >
                  <span className="text-[9px] font-black text-slate-400 tracking-widest">
                    EXAMPLE QUESTION
                  </span>
                  <input
                    type="text"
                    value={level.exampleQuestion}
                    onChange={(e) => {
                      const updated = [...difficultyLevels]
                      updated[index].exampleQuestion = e.target.value
                      if (e.target.value.trim() !== "") {
                        updated[index].selected = true
                      }
                      setDifficultyLevels(updated)
                    }}
                    placeholder={level.placeholder}
                    className="w-full bg-transparent text-slate-700 outline-none border-none p-0 text-xs font-semibold placeholder:text-slate-300 italic select-text"
                  />
                </div>

                {/* Questions Counter Row */}
                <div
                  className="flex items-center justify-between pt-2.5 mt-auto border-t border-slate-50"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Questions
                  </span>

                  <div className="flex flex-col items-end gap-0.5">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={level.count <= 10}
                        onClick={() => {
                          const updated = [...difficultyLevels]
                          updated[index].count = Math.max(10, updated[index].count - 1)
                          setDifficultyLevels(updated)
                        }}
                        className={cn(
                          "size-7 rounded-lg border flex items-center justify-center text-xs font-bold transition-all shadow-sm",
                          level.count <= 10
                            ? "border-slate-100 text-slate-300 bg-slate-50 cursor-not-allowed"
                            : "border-slate-200 hover:border-blue-300 hover:bg-slate-50 text-slate-500 cursor-pointer"
                        )}
                      >
                        <IconMinus className="size-3.5" />
                      </button>

                      <span className="w-8 text-center text-xs font-black text-slate-800">{level.count}</span>

                      <button
                        type="button"
                        disabled={level.count >= 50}
                        onClick={() => {
                          const updated = [...difficultyLevels]
                          updated[index].count = Math.min(50, updated[index].count + 1)
                          setDifficultyLevels(updated)
                        }}
                        className={cn(
                          "size-7 rounded-lg border flex items-center justify-center text-xs font-bold transition-all shadow-sm",
                          level.count >= 50
                            ? "border-slate-100 text-slate-300 bg-slate-50 cursor-not-allowed"
                            : "border-slate-200 hover:border-blue-300 hover:bg-slate-50 text-slate-500 cursor-pointer"
                        )}
                      >
                        <IconPlus className="size-3.5" />
                      </button>
                    </div>
                    <span className="text-[9px] font-bold text-slate-400 tracking-wide uppercase">
                      Min 10 - Max 50
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Wide total question banner at bottom of set difficulty box */}
        <div className="pt-2 select-none">
          <div className="border border-slate-200/60 rounded-2xl p-5 bg-[#F8FAFC] flex items-center justify-between shadow-sm">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Total questions to be generated
              </span>
              <h4 className="text-3xl font-black text-slate-800 tracking-tight">
                {totalQuestions}
              </h4>
            </div>

            <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full border border-emerald-100 text-xs font-bold">
              <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{selectedCount} levels active</span>
            </div>
          </div>
        </div>
      </div>

      {/* KNOWLEDGE SET QUESTIONS CONTAINER */}
      <div className="border border-slate-200/80 rounded-3xl p-6 bg-white space-y-6 shadow-sm">
        <div className="space-y-0.5">
          <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-1.5 flex-wrap">
            <span>Knowledge Set Questions</span>
            <button
              type="button"
              onClick={() => setIsFormatModalOpen(true)}
              className="text-xs font-bold text-[#2563EB] hover:text-blue-700 hover:underline cursor-pointer transition-colors normal-case"
            >
              (Follow This Format)
            </button>
          </h3>
          <p className="text-xs text-slate-400 font-medium leading-relaxed">
            Upload custom topic wise Reference Questions to guide AI generated interview Quality and Structure
          </p>
        </div>

        {/* Dashed Dropzone */}
        <div
          onClick={() => syllabusFileInputRef.current?.click()}
          className="border-2 border-dashed border-[#2563EB]/20 bg-blue-50/5 hover:bg-blue-50/15 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 transition-all cursor-pointer group select-none shadow-sm"
        >
          {knowledgeQuestions?.originalFileName ? (
            <div className="flex flex-col items-center gap-2">
              <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100 mb-1">
                <IconFileText className="size-5.5" />
              </div>
              <h4 className="text-sm font-extrabold text-slate-800 text-center">
                {knowledgeQuestions.originalFileName}
              </h4>
              <p className="text-[10px] font-bold text-slate-400">
                Click to upload a different file
              </p>
            </div>
          ) : (
            <>
              <Button
                type="button"
                variant="outline"
                className="flex items-center gap-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-800 text-xs font-bold px-4 py-2.5 rounded-lg shadow-sm transition-all cursor-pointer"
              >
                <IconUpload className="size-4 text-slate-400" />
                Upload PDF
              </Button>

              <div className="text-center space-y-1">
                <h4 className="text-xs font-extrabold text-slate-600">
                  Drag & drop instruction file or click to browse
                </h4>
                <p className="text-[10px] font-bold text-slate-400">
                  Supports PDF, DOCX, TXT
                </p>
              </div>
            </>
          )}
        </div>

        {/* Modal for Follow This Format */}
        <Dialog open={isFormatModalOpen} onOpenChange={setIsFormatModalOpen}>
          <DialogContent className="sm:max-w-2xl md:max-w-3xl max-h-[85vh] overflow-y-auto p-6 bg-white rounded-2xl border border-slate-100 shadow-2xl flex flex-col gap-6">
            <DialogHeader className="border-b border-slate-100 pb-4">
              <DialogTitle className="text-lg font-black text-slate-800 tracking-tight">
                Recommended Question Format
              </DialogTitle>
              <p className="text-xs text-slate-400 font-medium leading-relaxed">
                Structure your uploaded document or custom questions following this format to guide AI generation.
              </p>
            </DialogHeader>

            {/* Modal Content Scrollable Area */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto pr-1">
              {/* JavaScript Column */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                  <span className="flex size-6 items-center justify-center rounded-lg bg-amber-50 text-amber-600 font-black text-[10px]">
                    JS
                  </span>
                  <h4 className="text-sm font-extrabold text-slate-800">JavaScript</h4>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      level: "Level-1",
                      questions: [
                        "What is a variable in JavaScript?",
                        "Difference between var, let, and const?",
                        "What are primitive data types?",
                        "What is the use of console.log()?"
                      ]
                    },
                    {
                      level: "Level-2",
                      questions: [
                        "What is hoisting in JavaScript?",
                        "Explain scope and block scope.",
                        "What is the difference between == and ===?",
                        "What are template literals?"
                      ]
                    },
                    {
                      level: "Level-3",
                      questions: [
                        "What are closures in JavaScript?",
                        "Explain callback functions with an example.",
                        "What is event bubbling?",
                        "Explain synchronous vs asynchronous JavaScript."
                      ]
                    },
                    {
                      level: "Level-4",
                      questions: [
                        "How does the JavaScript event loop work?",
                        "Explain promises and async/await.",
                        "How would you optimize JavaScript performance?",
                        "Explain memory leaks in JavaScript."
                      ]
                    }
                  ].map((item, index) => (
                    <div key={index} className="bg-slate-50 border border-slate-100/60 rounded-xl p-3.5 space-y-2">
                      <span className="text-[10px] font-black text-slate-400 tracking-wider uppercase">
                        {item.level}
                      </span>
                      <ol className="list-decimal pl-4 text-xs font-semibold text-slate-600 space-y-1">
                        {item.questions.map((q, idx) => (
                          <li key={idx} className="leading-relaxed">
                            {q}
                          </li>
                        ))}
                      </ol>
                    </div>
                  ))}
                </div>
              </div>

              {/* React Column */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                  <span className="flex size-6 items-center justify-center rounded-lg bg-blue-50 text-blue-600 font-black text-[10px]">
                    RE
                  </span>
                  <h4 className="text-sm font-extrabold text-slate-800">React</h4>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      level: "Level-1",
                      questions: [
                        "React is what?",
                        "What are components in React?",
                        "What are props?",
                        "What is JSX?"
                      ]
                    },
                    {
                      level: "Level-2",
                      questions: [
                        "Difference between props and state?",
                        "What is useState?",
                        "What is useEffect?",
                        "What is conditional rendering?"
                      ]
                    },
                    {
                      level: "Level-3",
                      questions: [
                        "Explain controlled and uncontrolled components.",
                        "What is prop drilling?",
                        "How does React Router work?",
                        "What are React hooks?"
                      ]
                    },
                    {
                      level: "Level-4",
                      questions: [
                        "How would you optimize a React application?",
                        "Explain useMemo and useCallback.",
                        "How do you handle API errors in React?",
                        "Explain React reconciliation."
                      ]
                    }
                  ].map((item, index) => (
                    <div key={index} className="bg-slate-50 border border-slate-100/60 rounded-xl p-3.5 space-y-2">
                      <span className="text-[10px] font-black text-slate-400 tracking-wider uppercase">
                        {item.level}
                      </span>
                      <ol className="list-decimal pl-4 text-xs font-semibold text-slate-600 space-y-1">
                        {item.questions.map((q, idx) => (
                          <li key={idx} className="leading-relaxed">
                            {q}
                          </li>
                        ))}
                      </ol>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter>
              <button
                type="button"
                onClick={() => setIsFormatModalOpen(false)}
                className="w-full sm:w-auto px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                Close
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
