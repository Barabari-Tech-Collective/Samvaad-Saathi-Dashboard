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
  IconPaperclip,
  IconX,
  IconFileText,
  IconPalette,
  IconDeviceDesktop,
  IconChartLine,
  IconChartBar,
  IconTarget,
  IconHeartHandshake,
  IconArrowLeft,
  IconStarFilled,
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

const SAMPLE_KNOWLEDGE_SETS = [
  {
    id: "ui-ux",
    title: "UI / UX Designer",
    description: "Sample ui/ux knowledge set questions document format",
    icon: IconPalette,
    color: "bg-pink-50 text-pink-500",
    pdfUrl: "/sample-pdfs/ui_ux_question_bank.pdf"
  },
  {
    id: "fullstack",
    title: "Full Stack Developer",
    description: "Sample full stack knowledge set questions document format",
    icon: IconDeviceDesktop,
    color: "bg-blue-50 text-blue-500",
    pdfUrl: "/sample-pdfs/full_stack_developer_question_bank.pdf"
  },
  {
    id: "sales",
    title: "Sales Executive",
    description: "Sample sales knowledge set questions document format",
    icon: IconChartLine,
    color: "bg-emerald-50 text-emerald-500",
    pdfUrl: "/sample-pdfs/sales_executive_question_bank.pdf"
  },
  {
    id: "data-analyst",
    title: "Data Analyst",
    description: "Sample data analyst knowledge set questions document format",
    icon: IconChartBar,
    color: "bg-amber-50 text-amber-500",
    pdfUrl: "/sample-pdfs/data_analytics_question_bank.pdf"
  },
  {
    id: "hr",
    title: "HR & Talent",
    description: "Sample hr knowledge set questions document format",
    icon: IconHeartHandshake,
    color: "bg-rose-50 text-rose-500",
    pdfUrl: "coming_soon"
  }
]

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
  const jobDescription = form.watch("jobDescription") || ""
  const [isExtractorOpen, setIsExtractorOpen] = useState(false)
  const [isFormatModalOpen, setIsFormatModalOpen] = useState(false)
  const [selectedPdfUrl, setSelectedPdfUrl] = useState<string | null>(null)
  const [uploadedJDFileName, setUploadedJDFileName] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [knowledgeUploadError, setKnowledgeUploadError] = useState<string | null>(null)
  const [uploadedJDText, setUploadedJDText] = useState<string | null>(null)

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
    if (!uploadedJDFileName && (!jdText || jdText.length < 10)) {
      toast.error("Please enter a job description of at least 10 characters or upload a document first.")
      return
    }

    const toastId = toast.loading("Analyzing job description and extracting key skills...")

    try {
      const response = await extractSkillsAsync({ jobDescription: jdText || uploadedJDText || `File uploaded: ${uploadedJDFileName}` })

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
      setUploadError(null)
      const isValidExtension = file.name.toLowerCase().endsWith('.pdf') || file.name.toLowerCase().endsWith('.doc') || file.name.toLowerCase().endsWith('.docx')

      if (!isValidExtension) {
        toast.error("Unsupported File Format", {
          description: "Please upload your Job Description as a PDF (.pdf) or Word Document (.doc, .docx). Other formats are not allowed.",
          duration: 6000,
        })
        setUploadError("Only PDF or DOC/DOCX allowed")
        if (e.target) e.target.value = ''
        return
      }

      const toastId = toast.loading(`Uploading "${file.name}"...`)

      try {
        const formData = new FormData()
        formData.append("file", file)
        const response = await uploadJDAsync(formData)

        toast.dismiss(toastId)
        toast.success(`"${response.originalFileName}" uploaded successfully. You can now extract skills.`)

        const textFromResponse = response.extracted_text || response.extractedText || null

        setUploadedJDFileName(response.originalFileName || file.name)
        setUploadedJDText(textFromResponse)

        form.setValue("uploadedJDFileName", response.originalFileName || file.name, { shouldValidate: true })
        form.setValue("uploadedJDText", textFromResponse || "", { shouldValidate: true })

      } catch (error) {
        toast.dismiss(toastId)
        toast.error("Failed to upload JD. Please try again.")
        setUploadError("Upload failed")
        console.error(error)
      }
    }
  }

  async function handleSyllabusFileUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setKnowledgeUploadError(null)
      const isValidExtension = file.name.toLowerCase().endsWith('.pdf') || file.name.toLowerCase().endsWith('.doc') || file.name.toLowerCase().endsWith('.docx')

      if (!isValidExtension) {
        toast.error("Unsupported File Format", {
          description: "Please upload your Knowledge Set as a PDF (.pdf) or Word Document (.doc, .docx). Other formats are not allowed.",
          duration: 6000,
        })
        setKnowledgeUploadError("Invalid file type")
        if (e.target) e.target.value = ''
        return
      }

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
        setKnowledgeUploadError("Upload failed")
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
                  className="h-48 overflow-y-auto w-full border border-slate-200 rounded-2xl p-4 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none shadow-sm placeholder:text-slate-300 leading-relaxed bg-white transition-all font-medium select-text"
                  style={{ fieldSizing: "fixed" } as any}
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

        {/* Action Buttons Row */}
        <div className="flex flex-row items-center justify-between pt-2 w-full">
          {/* Extract Skills Button */}
          <Button
            type="button"
            variant="outline"
            onClick={toggleExtractor}
            disabled={jobDescription.length < 10 && !uploadedJDFileName}
            className="border border-[#2563EB]/30 hover:bg-blue-50/50 text-[#2563EB] hover:text-blue-700 text-xs font-bold px-4 py-2 h-9 rounded-full flex items-center gap-1.5 shadow-sm transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <IconSparkles className="size-4" />
            Extract skills
          </Button>

          {/* Upload Document Button */}
          <Button
            type="button"
            variant="outline"
            onClick={() => jdFileInputRef.current?.click()}
            title={uploadError || uploadedJDFileName || "Attach Document"}
            className={cn(
              "border hover:bg-slate-50 size-9 p-0 rounded-full flex items-center justify-center shadow-sm transition-all cursor-pointer select-none",
              uploadError
                ? "border-red-200 text-red-600 bg-red-50 hover:border-red-300 hover:bg-red-100"
                : uploadedJDFileName
                  ? "border-green-200 text-green-700 bg-green-50 hover:border-green-300 hover:bg-green-100"
                  : "border-slate-200 text-slate-600 hover:border-slate-300"
            )}
          >
            {uploadError ? (
              <IconAlertCircle className="size-4 text-red-500" />
            ) : uploadedJDFileName ? (
              <IconCheck className="size-4 text-green-600" />
            ) : (
              <IconFileText className="size-4 text-slate-600" />
            )}
          </Button>
        </div>

        {/* Suggested & Extracted Skills Section (Collapsible) */}
        {isExtractorOpen && (
          <div className="space-y-6 pt-4 border-t border-slate-100 animate-in fade-in duration-300">
            {/* Extracted Skills & Custom Input */}
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
          className={cn(
            "border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center gap-3 transition-all cursor-pointer group select-none shadow-sm",
            knowledgeUploadError
              ? "border-red-300 bg-red-50 hover:bg-red-100/80"
              : "border-[#2563EB]/20 bg-blue-50/5 hover:bg-blue-50/15"
          )}
        >
          {knowledgeUploadError ? (
            <div className="flex flex-col items-center gap-2">
              <div className="flex size-10 items-center justify-center rounded-xl bg-red-100 text-red-600 border border-red-200 mb-1">
                <IconAlertCircle className="size-5.5" />
              </div>
              <h4 className="text-sm font-extrabold text-red-700 text-center">
                {knowledgeUploadError}
              </h4>
              <p className="text-[10px] font-bold text-red-500">
                Click to upload a valid file
              </p>
            </div>
          ) : knowledgeQuestions?.originalFileName ? (
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
                title="Attach PDF"
                className="flex items-center justify-center size-10 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-800 rounded-lg shadow-sm transition-all cursor-pointer p-0"
              >
                <IconFileText className="size-5 text-slate-600" />
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
        <Dialog 
          open={isFormatModalOpen} 
          onOpenChange={(open) => {
            setIsFormatModalOpen(open)
            if (!open) setTimeout(() => setSelectedPdfUrl(null), 200) // Reset after close animation
          }}
        >
          <DialogContent className={cn(
            "p-0 bg-white rounded-2xl border border-slate-100 shadow-2xl flex flex-col overflow-hidden transition-all duration-300",
            selectedPdfUrl ? "sm:max-w-4xl h-[85vh]" : "sm:max-w-3xl max-h-[85vh]"
          )}>
            {!selectedPdfUrl ? (
              // GRID VIEW
              <div className="flex flex-col h-full">
                <div className="p-6 pb-4 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <IconStarFilled className="size-5 text-amber-400" />
                    <DialogTitle className="text-lg font-black text-slate-800 tracking-tight">
                      Sample Knowledge Sets
                    </DialogTitle>
                  </div>
                </div>
                
                <div className="p-6 pt-4 overflow-y-auto">
                  <p className="text-xs text-slate-400 font-medium leading-relaxed mb-6">
                    Browse role-specific sample question banks. Click any card to preview the full document format.
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {SAMPLE_KNOWLEDGE_SETS.map((item) => (
                      <div 
                        key={item.id}
                        onClick={() => setSelectedPdfUrl(item.pdfUrl)}
                        className="border border-slate-100 rounded-xl p-5 hover:border-blue-200 hover:shadow-md transition-all cursor-pointer group flex flex-col gap-3"
                      >
                        <div className={cn("size-10 rounded-lg flex items-center justify-center mb-2", item.color)}>
                          <item.icon className="size-5" />
                        </div>
                        <h4 className="text-sm font-extrabold text-slate-800 group-hover:text-blue-600 transition-colors">
                          {item.title}
                        </h4>
                        <p className="text-[10px] font-semibold text-slate-400 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center gap-2 text-xs font-bold text-slate-500">
                  <IconSparkles className="size-4 text-blue-500" />
                  These are sample formats. Upload your own PDF to set custom knowledge set questions.
                </div>
              </div>
            ) : (
              // PDF PREVIEW VIEW
              <div className="flex flex-col h-full bg-slate-50/50">
                <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-white">
                  <button 
                    onClick={() => setSelectedPdfUrl(null)}
                    className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
                  >
                    <IconArrowLeft className="size-4" />
                    Back to Samples
                  </button>
                  <div className="text-xs font-extrabold text-slate-800">
                    {SAMPLE_KNOWLEDGE_SETS.find(s => s.pdfUrl === selectedPdfUrl)?.title} Format Preview
                  </div>
                  <div className="w-20" /> {/* Spacer for centering */}
                </div>
                
                <div className="flex-1 w-full bg-slate-100 overflow-hidden relative p-4 flex items-center justify-center">
                  {selectedPdfUrl === "coming_soon" ? (
                    <div className="flex flex-col items-center justify-center gap-3">
                      <IconSparkles className="size-8 text-slate-400" />
                      <p className="text-sm font-bold text-slate-500">Coming soon ..</p>
                    </div>
                  ) : (
                    <iframe 
                      src={selectedPdfUrl} 
                      className="w-full h-full rounded-xl border border-slate-200 shadow-sm bg-white"
                      title="PDF Preview"
                    />
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
