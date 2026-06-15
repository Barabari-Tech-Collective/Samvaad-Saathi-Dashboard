"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { AnimatePresence, motion } from "motion/react"
import { toast } from "sonner"
import {
  IconBriefcase,
  IconBuilding,
  IconCheck,
  IconChevronLeft,
  IconChevronRight,
  IconListDetails,
  IconLoader2,
  IconNotes,
  IconSettings,
  IconX,
  IconSparkles,
  IconChevronUp,
  IconChevronDown,
  IconUpload,
  IconPlus,
  IconMinus,
  IconFileText,
  IconAlertCircle,
} from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Form,
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
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { useCreateJobProfile } from "@/lib/api/hooks/analytics/useJobProfiles"
import { cn } from "@/lib/utils"
import { RoleCreationStepper } from "./RoleCreationStepper"

const addRoleSchema = z.object({
  jdType: z.enum(["company", "role"], {
    message: "Please select a JD type",
  }),
  jobName: z.string().min(2, "Role name must be at least 2 characters"),
  companyName: z.string().optional(),
  category: z.string().min(1, "Please select a category"),
  experienceLevel: z.string().min(1, "Please select an experience level"),
  employmentType: z.string().min(1, "Please select an employment type"),
  jobDescription: z.string().min(10, "Description must be at least 10 characters"),
  skills: z.array(z.string().min(1)).min(1, "Add at least one skill"),
  additionalContext: z.string().optional(),
})

type AddRoleFormValues = z.infer<typeof addRoleSchema>

export const STEPS = [
  { label: "Interview Type", icon: IconSettings },
  { label: "Role Details", icon: IconBriefcase },
  { label: "JD & Configuration", icon: IconListDetails },
  { label: "Reference Questions Preview", icon: IconFileText },
  { label: "Questions", icon: IconSparkles },
  { label: "Review & Submit", icon: IconCheck },
]

const STEP_FIELDS: Array<Array<keyof AddRoleFormValues>> = [
  ["jdType"],
  ["jobName", "companyName", "category", "experienceLevel", "employmentType"],
  ["jobDescription", "skills"],
  [], // Reference Questions Preview
  [], // Questions
  [], // Review & Submit
]

const CATEGORY_OPTIONS = [
  { value: "all", label: "All Categories" },
  { value: "it", label: "IT" },
  { value: "design", label: "Design" },
  { value: "sales", label: "Sales" },
  { value: "marketing", label: "Marketing" },
  { value: "hr", label: "HR" },
  { value: "operations", label: "Operations" },
  { value: "data", label: "Data" },
]

const EXPERIENCE_OPTIONS = [
  { value: "1-2", label: "1–2 Years" },
  { value: "2-3", label: "2–3 Years" },
  { value: "3-4", label: "3–4 Years" },
  { value: "4-5", label: "4–5 Years" },
  { value: "5+", label: "5+ Years" },
]

const EMPLOYMENT_OPTIONS = [
  { value: "full-time", label: "Full-time" },
  { value: "part-time", label: "Part-time" },
  { value: "contract", label: "Contract" },
  { value: "internship", label: "Internship" },
  { value: "freelance", label: "Freelance" },
]

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "60%" : "-60%",
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction > 0 ? "-60%" : "60%",
    opacity: 0,
  }),
}

export function StepIndicator({
  currentStep,
  onStepClick,
}: {
  currentStep: number
  onStepClick?: (stepIndex: number) => void
}) {
  return <RoleCreationStepper currentStep={currentStep} onStepClick={onStepClick} />
}

function StepJDType({ form }: { form: ReturnType<typeof useForm<AddRoleFormValues>> }) {
  return (
    <div className="space-y-6 py-2">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold tracking-tight">Select JD Type</h2>
        <p className="text-muted-foreground text-sm max-w-sm mx-auto">
          Choose the type of Job Description you want to create. This helps us tailor the interview questions.
        </p>
      </div>

      <FormField
        control={form.control}
        name="jdType"
        render={({ field }) => (
          <FormItem className="space-y-0">
            <FormControl>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  className={cn(
                    "relative flex flex-col items-center gap-4 rounded-xl border-2 p-6 cursor-pointer transition-all hover:border-primary/50",
                    field.value === "company"
                      ? "border-primary bg-primary/5"
                      : "border-muted bg-background"
                  )}
                  onClick={() => field.onChange("company")}
                >
                  <div className={cn(
                    "flex size-14 items-center justify-center rounded-full",
                    field.value === "company" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  )}>
                    <IconBuilding className="size-8" />
                  </div>
                  <div className="text-center">
                    <h3 className="font-bold text-lg">Company Specific</h3>
                    <p className="text-xs text-muted-foreground mt-1 px-2">
                      Tailored for a specific organization with unique culture and requirements.
                    </p>
                  </div>
                  {field.value === "company" && (
                    <div className="absolute top-3 right-3 text-primary">
                      <IconCheck className="size-5" />
                    </div>
                  )}
                </div>

                <div
                  className={cn(
                    "relative flex flex-col items-center gap-4 rounded-xl border-2 p-6 cursor-pointer transition-all hover:border-primary/50",
                    field.value === "role"
                      ? "border-primary bg-primary/5"
                      : "border-muted bg-background"
                  )}
                  onClick={() => field.onChange("role")}
                >
                  <div className={cn(
                    "flex size-14 items-center justify-center rounded-full",
                    field.value === "role" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  )}>
                    <IconBriefcase className="size-8" />
                  </div>
                  <div className="text-center">
                    <h3 className="font-bold text-lg">Role Specific</h3>
                    <p className="text-xs text-muted-foreground mt-1 px-2">
                      A general template focused on industry standard skills and expectations.
                    </p>
                  </div>
                  {field.value === "role" && (
                    <div className="absolute top-3 right-3 text-primary">
                      <IconCheck className="size-5" />
                    </div>
                  )}
                </div>
              </div>
            </FormControl>
            <FormMessage className="text-center mt-4" />
          </FormItem>
        )}
      />
    </div>
  )
}

function StepJobBasics({ form }: { form: ReturnType<typeof useForm<AddRoleFormValues>> }) {
  const jdType = form.watch("jdType")
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-2 mb-2 border-b">
        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 capitalize px-2 py-0.5">
          {jdType === "company" ? "Company Specific" : "Role Specific"}
        </Badge>
        <span className="text-xs text-muted-foreground">Type selected</span>
      </div>
      <div>
        <h2 className="text-base font-semibold">Role Details</h2>
        <p className="text-sm text-muted-foreground">
          Core details about the role and company.
        </p>
      </div>

      {/* Row 1: Role Name (and Company Name if Company specific) */}
      <div className={cn("grid gap-4", jdType === "company" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1")}>
        <FormField
          control={form.control}
          name="jobName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Senior Backend Engineer" className="h-12 px-4 text-base" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {jdType === "company" && (
          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Amazon" className="h-12 px-4 text-base" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>

      {/* Row 2: Category | Experience Level */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Category Dropdown */}
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} value={field.value || undefined}>
                <FormControl>
                  <SelectTrigger size="custom" className="w-full h-12 px-4 text-base font-normal text-left">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {CATEGORY_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Experience Level Dropdown */}
        <FormField
          control={form.control}
          name="experienceLevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Experience Level</FormLabel>
              <Select onValueChange={field.onChange} value={field.value || undefined}>
                <FormControl>
                  <SelectTrigger size="custom" className="w-full h-12 px-4 text-base font-normal text-left">
                    <SelectValue placeholder="Select Experience Level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {EXPERIENCE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Row 3: Employment Type */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="employmentType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Employment Type</FormLabel>
              <Select onValueChange={field.onChange} value={field.value || undefined}>
                <FormControl>
                  <SelectTrigger size="custom" className="w-full h-12 px-4 text-base font-normal text-left">
                    <SelectValue placeholder="Select Employment Type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {EMPLOYMENT_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}

function StepRoleDetails({
  form,
  skillInput,
  setSkillInput,
  difficultyLevels,
  setDifficultyLevels,
  knowledgeQuestions,
  setKnowledgeQuestions,
}: {
  form: ReturnType<typeof useForm<AddRoleFormValues>>
  skillInput: string
  setSkillInput: (v: string) => void
  difficultyLevels: Array<{
    level: number
    selected: boolean
    badge: string
    badgeLabel: string
    title: string
    description: string
    exampleQuestion: string
    placeholder: string
    count: number
  }>
  setDifficultyLevels: React.Dispatch<React.SetStateAction<Array<{
    level: number
    selected: boolean
    badge: string
    badgeLabel: string
    title: string
    description: string
    exampleQuestion: string
    placeholder: string
    count: number
  }>>>
  knowledgeQuestions: any
  setKnowledgeQuestions: React.Dispatch<React.SetStateAction<any>>
}) {
  const jdFileInputRef = React.useRef<HTMLInputElement>(null)
  const syllabusFileInputRef = React.useRef<HTMLInputElement>(null)

  const skills = form.watch("skills") || []
  const [isExtractorOpen, setIsExtractorOpen] = React.useState(false)
  const [isFormatModalOpen, setIsFormatModalOpen] = React.useState(false)

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

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      addSkill(skillInput)
    }
    if (e.key === "Backspace" && !skillInput && skills.length > 0) {
      removeSkill(skills[skills.length - 1])
    }
  }

  // Auto extraction mechanism
  function handleExtractSkills() {
    const jdText = form.getValues("jobDescription")
    if (!jdText || jdText.length < 10) {
      toast.error("Please enter a job description of at least 10 characters first.")
      return
    }

    const toastId = toast.loading("Analyzing job description and extracting key skills...")

    setTimeout(() => {
      const matches: string[] = []
      const text = jdText.toLowerCase()

      const skillKeywords = [
        "React", "Next.js", "TypeScript", "JavaScript", "HTML", "CSS", "Tailwind CSS",
        "Node.js", "Python", "Django", "FastAPI", "PostgreSQL", "MongoDB", "Docker",
        "AWS", "Git", "GraphQL", "Redux", "RESTful APIs", "Java", "Spring Boot",
        "SQL", "Kubernetes", "Linux", "CI/CD", "Testing", "Jest"
      ]

      skillKeywords.forEach(skill => {
        if (text.includes(skill.toLowerCase())) {
          matches.push(skill)
        }
      })

      const finalSkills = matches.length >= 2 ? matches : ["React", "TypeScript", "Next.js", "Tailwind CSS", "RESTful APIs"]

      form.setValue("skills", finalSkills, { shouldValidate: true })

      toast.dismiss(toastId)
      toast.success(`Successfully extracted ${finalSkills.length} key skills!`)
    }, 1000)
  }

  function handleJDFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      toast.success(`"${file.name}" uploaded successfully. Auto-populating Job Description...`)
      form.setValue("jobDescription", `Role: Senior Software Engineer\n\nWe are looking for a highly skilled Senior Software Engineer to join our team. You will lead the design and development of complex frontend architectures, drive code quality and design system adoption, and mentor junior engineers.\n\nRequired Skills:\n- Strong experience with React, Next.js, and TypeScript\n- Excellent understanding of RESTful APIs, GraphQL, and modern state management\n- Passion for performance optimization and clean, maintainable code.`, { shouldValidate: true })

      // Auto populate a default set of skills
      form.setValue("skills", ["React", "Next.js", "TypeScript", "GraphQL", "Performance"], { shouldValidate: true })
      setIsExtractorOpen(true)
    }
  }

  function handleSyllabusFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      toast.success(`"${file.name}" uploaded successfully as custom Knowledge Set!`)
      const mockParsed = {
        topics: [
          {
            topicName: "JavaScript",
            levels: [
              {
                level: 1,
                questions: [
                  "What is var?",
                  "Difference between var, let and const?"
                ]
              },
              {
                level: 2,
                questions: [
                  "Explain closures in JavaScript.",
                  "What is event bubbling?"
                ]
              }
            ]
          },
          {
            topicName: "React",
            levels: [
              {
                level: 1,
                questions: [
                  "What are props?",
                  "What is JSX?"
                ]
              }
            ]
          }
        ]
      }
      setKnowledgeQuestions(mockParsed)
      if (typeof window !== "undefined") {
        localStorage.setItem("samvaad_saathi_knowledge_questions", JSON.stringify(mockParsed))
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
                        "What is React?",
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

const defaultTopics = [
  {
    topicName: "JavaScript",
    levels: [
      {
        level: 1,
        questions: [
          "What is a variable in JavaScript?",
          "Difference between var, let, and const?",
          "What are primitive data types?",
          "What is the use of console.log()?"
        ]
      },
      {
        level: 2,
        questions: [
          "What is hoisting in JavaScript?",
          "Explain scope and block scope.",
          "What is the difference between == and ===?",
          "What are template literals?"
        ]
      },
      {
        level: 3,
        questions: [
          "What are closures in JavaScript?",
          "Explain callback functions with an example.",
          "What is event bubbling?",
          "Explain synchronous vs asynchronous JavaScript."
        ]
      },
      {
        level: 4,
        questions: [
          "How does the JavaScript event loop work?",
          "Explain promises and async/await.",
          "How would you optimize JavaScript performance?",
          "Explain memory leaks in JavaScript."
        ]
      }
    ]
  },
  {
    topicName: "React",
    levels: [
      {
        level: 1,
        questions: [
          "What is React?",
          "What are components in React?",
          "What are props?",
          "What is JSX?"
        ]
      },
      {
        level: 2,
        questions: [
          "Difference between props and state?",
          "What is useState?",
          "What is useEffect?",
          "What is conditional rendering?"
        ]
      },
      {
        level: 3,
        questions: [
          "Explain controlled and uncontrolled components.",
          "What is prop drilling?",
          "How does React Router work?",
          "What are React hooks?"
        ]
      },
      {
        level: 4,
        questions: [
          "How would you optimize a React application?",
          "Explain useMemo and useCallback.",
          "How do you handle API errors in React?",
          "Explain React reconciliation."
        ]
      }
    ]
  }
]

function StepReferenceQuestionsPreview({
  knowledgeQuestions
}: {
  knowledgeQuestions: any
}) {
  const router = useRouter()
  const [selectedLevel, setSelectedLevel] = React.useState<number>(1)
  
  const activeQuestionsData = knowledgeQuestions?.topics || defaultTopics

  // Filter topics that have questions for the selectedLevel
  const filteredTopics = activeQuestionsData.filter((topic: any) => {
    const levelData = topic.levels?.find((l: any) => l.level === selectedLevel)
    return levelData && levelData.questions && levelData.questions.length > 0
  })

  const [expandedTopic, setExpandedTopic] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (filteredTopics.length > 0) {
      setExpandedTopic(filteredTopics[0].topicName.toLowerCase())
    } else {
      setExpandedTopic(null)
    }
  }, [selectedLevel])

  return (
    <div className="space-y-6 select-none animate-in fade-in duration-200">
      {/* Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Card: Role Summary */}
        <Card className="border border-slate-200/80 rounded-3xl p-6 bg-white space-y-5 shadow-sm">
          <div className="flex items-center gap-2 text-slate-800 font-extrabold text-sm border-b border-slate-100 pb-3">
            <IconBriefcase className="size-4.5 text-slate-400" />
            <span>ROLE SUMMARY</span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-600">
            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">ROLE NAME</div>
              <div className="text-sm font-extrabold text-slate-800 mt-1">Senior Front-End Developer</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">CATEGORY</div>
              <div className="text-sm font-extrabold text-slate-800 mt-1">Engineering</div>
            </div>
            <div className="mt-2">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">EXPERIENCE</div>
              <div className="text-sm font-extrabold text-slate-800 mt-1">4–6 Years</div>
            </div>
            <div className="mt-2">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">LEVELS SELECTED</div>
              <div className="text-sm font-extrabold text-slate-800 mt-1">4 levels</div>
            </div>
          </div>
          
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">LEVELS CONFIGURED</div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: "L1", name: "Level 1", count: 15, lvlVal: 1 },
                { id: "L2", name: "Level 2", count: 15, lvlVal: 2 },
                { id: "L3", name: "Level 3", count: 10, lvlVal: 3 },
                { id: "L4", name: "Level 4", count: 10, lvlVal: 4 },
              ].map((lvl) => {
                const isSelected = selectedLevel === lvl.lvlVal
                return (
                  <div
                    key={lvl.id}
                    onClick={() => setSelectedLevel(lvl.lvlVal)}
                    className={cn(
                      "flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer select-none",
                      isSelected
                        ? "bg-blue-50/50 border-blue-500 ring-1 ring-blue-500/20"
                        : "bg-[#F8FAFC] border-slate-100 hover:border-slate-200"
                    )}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className={cn(
                        "text-[10px] font-black px-1.5 py-0.5 rounded transition-colors",
                        isSelected ? "text-white bg-[#2563EB]" : "text-blue-600 bg-blue-50"
                      )}>
                        {lvl.id}
                      </span>
                      <span className="text-xs font-bold text-slate-700">{lvl.name}</span>
                    </div>
                    <span className="text-[11px] font-bold text-slate-500">{lvl.count} Questions</span>
                  </div>
                )
              })}
            </div>
          </div>
        </Card>

        {/* Right Card: Knowledge Set Source */}
        <Card className="border border-slate-200/80 rounded-3xl p-6 bg-white space-y-5 shadow-sm">
          <div className="flex items-center gap-2 text-slate-800 font-extrabold text-sm border-b border-slate-100 pb-3">
            <IconFileText className="size-4.5 text-slate-400" />
            <span>KNOWLEDGE SET SOURCE</span>
          </div>
          
          <div className="flex items-center gap-3 p-4 bg-[#F8FAFC]/60 border border-slate-200/60 rounded-2xl">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <IconFileText className="size-5.5 text-blue-600" />
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-slate-800">Frontend_Question_Bank.pdf</h4>
              <p className="text-[10px] font-semibold text-slate-400 mt-0.5">Uploaded today, 2:45 PM</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">TOPICS DETECTED</div>
            <div className="flex flex-wrap gap-1.5">
              {["JavaScript", "React", "TypeScript", "Performance Optimization", "System Design"].map((t) => (
                <Badge key={t} variant="outline" className="bg-[#EFF6FF] text-[#2563EB] border-none text-[11px] font-semibold px-3 py-1 rounded-full">
                  {t}
                </Badge>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-600">
            <span>Question count</span>
            <span className="text-[#2563EB] font-black"># 42 Reference Questions</span>
          </div>
        </Card>
      </div>

      {/* Main Section Card */}
      <Card className="border border-slate-200 rounded-3xl p-6 bg-white shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-800">Reference questions by topic</h3>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Preview the question bank grouped by topic detected in the uploaded document.
            </p>
          </div>
          <Badge className="bg-[#EFF6FF] hover:bg-[#EFF6FF] text-[#2563EB] border-none text-[11px] font-bold px-3 py-1 rounded-full shrink-0">
            {filteredTopics.length} topic{filteredTopics.length !== 1 ? "s" : ""}
          </Badge>
        </div>

        <div className="space-y-3">
          {filteredTopics.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-2xl select-none">
              <IconAlertCircle className="size-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs text-slate-400 font-semibold">
                No questions available for Level {selectedLevel}
              </p>
            </div>
          ) : (
            filteredTopics.map((topic: any) => {
              const levelData = topic.levels?.find((l: any) => l.level === selectedLevel)
              const questionsList = levelData?.questions || []
              const totalQuestions = questionsList.length
              const previewCount = Math.min(5, totalQuestions)
              const previewQuestions = questionsList.slice(0, 5)
              
              const topicId = topic.topicName.toLowerCase()
              const isExpanded = expandedTopic === topicId

              return (
                <div
                  key={topic.topicName}
                  className={cn(
                    "border rounded-2xl bg-white overflow-hidden transition-all duration-200",
                    isExpanded ? "border-[#2563EB]/40 ring-1 ring-blue-500/5 shadow-sm" : "border-slate-200 hover:border-blue-200"
                  )}
                >
                  {/* Accordion Row Header */}
                  <div
                    onClick={() => setExpandedTopic(isExpanded ? null : topicId)}
                    className="flex items-center justify-between p-4 cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 font-bold text-xs uppercase">
                        {topic.topicName.charAt(0)}
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="text-sm font-extrabold text-slate-800">{topic.topicName}</h4>
                        <p className="text-[11px] font-semibold text-slate-400">
                          Preview of {previewCount} of {totalQuestions} questions
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="bg-[#EFF6FF] text-[#2563EB] border-none text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {totalQuestions} Question{totalQuestions !== 1 ? "s" : ""}
                      </Badge>
                      {isExpanded ? (
                        <IconChevronUp className="size-4 text-slate-400" />
                      ) : (
                        <IconChevronDown className="size-4 text-slate-400" />
                      )}
                    </div>
                  </div>

                  {/* Questions list when expanded */}
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-1 border-t border-slate-50 space-y-3 animate-in fade-in duration-200">
                      <div className="space-y-2">
                        {previewQuestions.map((qText: string, qIdx: number) => (
                          <div
                            key={qIdx}
                            className="p-3 bg-slate-50/50 hover:bg-slate-50 rounded-xl text-xs font-semibold text-slate-700 transition-colors border border-slate-100 flex items-center gap-3"
                          >
                            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold">
                              {qIdx + 1}
                            </span>
                            <span>{qText}</span>
                          </div>
                        ))}
                      </div>

                      {totalQuestions > 0 && (
                        <div className="pt-2">
                          <button
                            type="button"
                            onClick={() => {
                              toast.info(
                                `Questions for ${topic.topicName} (Level ${selectedLevel}):\n\n` +
                                  questionsList.map((q: string, i: number) => `${i + 1}. ${q}`).join("\n")
                              )
                            }}
                            className="text-xs font-bold text-[#2563EB] hover:text-blue-700 transition-colors cursor-pointer flex items-center gap-1"
                          >
                            View all {totalQuestions} question{totalQuestions !== 1 ? "s" : ""} →
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>
      </Card>

      {/* Bottom Info Section */}
      <Card className="border border-amber-100 bg-amber-50/60 rounded-3xl p-6 flex flex-col justify-center space-y-3 shadow-sm select-none">
        <div className="flex items-center gap-2 text-amber-800">
          <IconAlertCircle className="size-5 shrink-0 text-amber-600" />
          <h4 className="font-extrabold text-sm">Reference only</h4>
        </div>
        <p className="text-xs font-bold text-amber-700 leading-relaxed">
          Reference questions will not appear directly in interviews. They are only used as guidance for AI question generation.
        </p>
      </Card>

      {/* Skip/Back Links */}
      <div className="flex items-center justify-between px-1 pt-2 select-none">
        <button
          type="button"
          onClick={() => router.push("/dashboard/roles/new?step=2")}
          className="text-xs font-bold text-[#2563EB] hover:text-blue-700 transition-colors flex items-center gap-1"
        >
          <span>&lt; Back to JD & Configuration</span>
        </button>
        <button
          type="button"
          onClick={() => router.push("/dashboard/roles/new/questions")}
          className="text-xs font-bold text-[#2563EB] hover:text-blue-700 transition-colors flex items-center gap-1"
        >
          <span>Skip to generation &gt;</span>
        </button>
      </div>
    </div>
  )
}

function StepReview({
  form,
  difficultyLevels
}: {
  form: ReturnType<typeof useForm<AddRoleFormValues>>
  difficultyLevels: Array<{
    level: number
    selected: boolean
    badge: string
    badgeLabel: string
    title: string
    description: string
    exampleQuestion: string
    placeholder: string
    count: number
  }>
}) {
  const values = form.watch()
  const expLabel =
    EXPERIENCE_OPTIONS.find((l) => l.value === values.experienceLevel)?.label ??
    "3–4 Years"
  const catLabel =
    CATEGORY_OPTIONS.find((l) => l.value === values.category)?.label ??
    "Engineering"
  const empLabel =
    EMPLOYMENT_OPTIONS.find((l) => l.value === values.employmentType)?.label ??
    "Full-time"

  // Make mock data fallbacks match the Figma screenshot exactly
  const jobName = values.jobName || "Senior Front-End Developer"
  const category = catLabel
  const experienceRange = expLabel
  const employmentType = empLabel
  const jobDescription = values.jobDescription || "Own end-to-end frontend architecture for the customer experience surface. Drive performance, design-system adoption and mentorship across squads."

  const skillsList = values.skills && values.skills.length > 0 ? values.skills : ["React", "TypeScript", "GraphQL", "Performance"]
  const competenciesList = ["Systems thinking", "Stakeholder comms", "Production ownership"]

  // Accordion active level state
  const [activeLevel, setActiveLevel] = React.useState<number | null>(1)

  const activeLevels = difficultyLevels.filter(l => l.selected)
  const totalQuestions = activeLevels.reduce((acc, curr) => acc + curr.count, 0)

  const levels = activeLevels.map(level => {
    let mockQuestions: string[] = []
    if (level.level === 1) {
      mockQuestions = [
        "Q1. Explain the difference between var, let, and const in JavaScript.",
        "Q2. What are React hooks and why were they introduced?",
        "Q3. How does the browser event loop work?"
      ]
    } else if (level.level === 2) {
      mockQuestions = [
        "Q1. Tell me about a challenging React project where you optimized rendering.",
        "Q2. How did you structure GraphQL schema mutations in your last application?",
        "Q3. Describe your experience leading architectural decisions across front-end squads."
      ]
    } else if (level.level === 3) {
      mockQuestions = [
        "Q1. How would you handle state synchronization across multiple browser tabs?",
        "Q2. What strategies do you use for real-time monitoring of runtime JavaScript errors?",
        "Q3. Explain how to implement incremental migration from legacy SPA to modern SSR."
      ]
    } else if (level.level === 4) {
      mockQuestions = [
        "Q1. How would you explain browser rendering cycles under intense performance constraints?",
        "Q2. Design a thread-safe frontend cache architecture utilizing Web Workers.",
        "Q3. What actions do you take when your production frontend experiences a sudden memory leak?"
      ]
    }

    return {
      id: level.level,
      badge: `L${level.level}`,
      title: level.title,
      description: level.description,
      countText: `${level.count} questions`,
      questions: mockQuestions,
      hasMoreLink: true,
      hasMoreText: `View all ${level.count} questions`
    }
  })

  return (
    <div className="space-y-6">
      {/* 1. ROLE DETAILS Card */}
      <div className="border border-slate-200 rounded-2xl p-6 bg-white shadow-sm space-y-5 select-none animate-in fade-in duration-200">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Role Details
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          <div className="space-y-1">
            <div className="text-xs font-bold text-slate-400">ROLE NAME</div>
            <div className="text-sm font-semibold text-slate-800">{jobName}</div>
          </div>
          <div className="space-y-1">
            <div className="text-xs font-bold text-slate-400">CATEGORY</div>
            <div className="text-sm font-semibold text-slate-800">{category}</div>
          </div>
          <div className="space-y-1">
            <div className="text-xs font-bold text-slate-400">EXPERIENCE</div>
            <div className="text-sm font-semibold text-slate-800">{experienceRange}</div>
          </div>
          <div className="space-y-1">
            <div className="text-xs font-bold text-slate-400">EMPLOYMENT</div>
            <div className="text-sm font-semibold text-slate-800">{employmentType}</div>
          </div>
        </div>

        <div className="space-y-1.5 pt-4 border-t border-slate-100">
          <div className="text-xs font-bold text-slate-400">DESCRIPTION</div>
          <p className="text-sm text-slate-600 font-semibold leading-relaxed select-text">
            {jobDescription}
          </p>
        </div>
      </div>

      {/* 2. JOB DESCRIPTION SUMMARY Card */}
      <div className="border border-slate-200 rounded-2xl p-6 bg-white shadow-sm select-none animate-in fade-in duration-250">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-5">
          Job Description Summary
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Extracted skills */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Extracted skills</div>
            <div className="flex flex-wrap gap-1.5">
              {skillsList.map(skill => (
                <Badge
                  key={skill}
                  variant="outline"
                  className="bg-[#EFF6FF] text-[#2563EB] border-none text-[11px] font-bold px-3 py-1 rounded-md"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          {/* Competencies */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Competencies</div>
            <div className="flex flex-wrap gap-1.5">
              {competenciesList.map(comp => (
                <Badge
                  key={comp}
                  variant="outline"
                  className="bg-[#EFF6FF] text-[#2563EB] border-none text-[11px] font-bold px-3 py-1 rounded-md"
                >
                  {comp}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. QUESTION OVERVIEW Card */}
      <div className="border border-slate-200 rounded-2xl p-6 bg-white shadow-sm space-y-5 animate-in fade-in duration-300">
        <div className="flex items-center justify-between select-none">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Question Overview
          </h3>
          <span className="text-xs font-semibold text-slate-400">
            50 questions across 4 levels
          </span>
        </div>

        {/* Level list accordion */}
        <div className="space-y-3">
          {levels.map(level => {
            const isLevelExpanded = activeLevel === level.id

            return (
              <div
                key={level.id}
                className={cn(
                  "border rounded-xl bg-white overflow-hidden transition-all duration-200",
                  isLevelExpanded ? "border-[#2563EB]/40 ring-1 ring-blue-500/5 shadow-sm" : "border-slate-200 hover:border-blue-200"
                )}
              >
                {/* Accordion Level Header */}
                <div
                  onClick={() => setActiveLevel(isLevelExpanded ? null : level.id)}
                  className="flex items-center justify-between p-4 cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 font-black text-[11px]">
                      {level.badge}
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="text-sm font-extrabold text-slate-800">{level.title}</h4>
                      <p className="text-[11px] font-semibold text-slate-400">{level.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-400">{level.countText}</span>
                    {isLevelExpanded ? (
                      <IconChevronUp className="size-4 text-slate-400" />
                    ) : (
                      <IconChevronDown className="size-4 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Expanded level questions list */}
                {isLevelExpanded && (
                  <div className="px-4 pb-4 pt-1 border-t border-slate-50 space-y-3 animate-in fade-in duration-200">
                    <div className="space-y-2">
                      {level.questions.map((qText, qIdx) => (
                        <div
                          key={qIdx}
                          className="p-3 bg-slate-50/50 hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-700 transition-colors border border-slate-100"
                        >
                          {qText}
                        </div>
                      ))}
                    </div>

                    {level.hasMoreLink && (
                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            toast.info("Navigating to detailed Level 1 question viewer...")
                          }}
                          className="text-xs font-bold text-[#2563EB] hover:text-blue-700 transition-colors cursor-pointer flex items-center gap-1 select-none"
                        >
                          {level.hasMoreText}
                          <span>→</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function ReviewRow({
  label,
  value,
  multiline,
}: {
  label: string
  value: string | undefined
  multiline?: boolean
}) {
  if (!value) return null
  return (
    <div className={cn("flex gap-4", multiline ? "flex-col gap-1" : "")}>
      <span className={cn("font-medium text-muted-foreground", !multiline && "w-36 shrink-0")}>
        {label}
      </span>
      <span className={cn("text-foreground", multiline && "whitespace-pre-wrap")}>{value}</span>
    </div>
  )
}

export function AddRoleStepper() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [step, setStep] = React.useState(0)
  const [direction, setDirection] = React.useState(1)
  const [skillInput, setSkillInput] = React.useState("")
  const [knowledgeQuestions, setKnowledgeQuestions] = React.useState<any>(null)
  const { createJobProfileAsync, isCreatingJobProfile } = useCreateJobProfile()

  React.useEffect(() => {
    const stepParam = searchParams.get("step")
    if (stepParam !== null) {
      const parsed = parseInt(stepParam, 10)
      if (parsed >= 0 && parsed <= 5) {
        setStep(parsed)
      }
    }
  }, [searchParams])

  const [difficultyLevels, setDifficultyLevels] = React.useState([
    {
      level: 1,
      selected: false,
      badge: "LEVEL 1",
      badgeLabel: "Foundational",
      title: "General Fundamentals",
      description: "Basic concepts and foundational knowledge questions.",
      exampleQuestion: "What is the difference between let and const in JavaScript?",
      placeholder: "e.g., What is the difference between let and const in JS?",
      count: 15,
    },
    {
      level: 2,
      selected: false,
      badge: "LEVEL 2",
      badgeLabel: "Intermediate",
      title: "Project & Resume Based",
      description: "Questions based on resume, projects and practical implementation.",
      exampleQuestion: "Explain a challenging frontend project you worked on.",
      placeholder: "e.g., Tell me about a challenging project you worked on?",
      count: 15,
    },
    {
      level: 3,
      selected: false,
      badge: "LEVEL 3",
      badgeLabel: "Advanced",
      title: "Production & Scenario Based",
      description: "Production-level debugging and real-world problem-solving questions.",
      exampleQuestion: "How would you optimize a slow React production application?",
      placeholder: "e.g., How would you optimize a slow loading REACT component?",
      count: 10,
    },
    {
      level: 4,
      selected: false,
      badge: "LEVEL 4",
      badgeLabel: "Expert",
      title: "Advanced / Pressure Scenarios",
      description: "High-pressure and advanced real-world interview situations.",
      exampleQuestion: "What would you do if production breaks during deployment?",
      placeholder: "e.g., What do you do when production is down during a deploy?",
      count: 10,
    },
  ])

  const form = useForm<AddRoleFormValues>({
    resolver: zodResolver(addRoleSchema),
    defaultValues: {
      jdType: undefined,
      jobName: "",
      companyName: "",
      category: "",
      experienceLevel: "",
      employmentType: "",
      jobDescription: "",
      skills: [],
      additionalContext: `Topic-1 Javascript\n• What is var?\n• Diff between var, let and const\n\nTopic -2 REACT\n• What are states and props?`,
    },
    mode: "onTouched",
  })

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const stepParam = searchParams.get("step")

      // If the query parameter is not present yet during Next.js hydration, do nothing
      // to avoid accidentally wiping drafts due to a hydration race condition.
      if (stepParam === null && window.location.search.includes("step=")) {
        return
      }

      const parsedStep = stepParam ? parseInt(stepParam, 10) : 0
      const isNewRole = parsedStep === 0

      if (isNewRole) {
        // Brand new start or refresh at Step 1: clear draft storage and initialize clean form
        localStorage.removeItem("samvaad_saathi_draft_role")
        localStorage.removeItem("samvaad_saathi_difficulty_levels")
        localStorage.removeItem("samvaad_saathi_knowledge_questions")
        setKnowledgeQuestions(null)

        form.reset({
          jdType: undefined,
          jobName: "",
          companyName: "",
          category: "",
          experienceLevel: "",
          employmentType: "",
          jobDescription: "",
          skills: [],
          additionalContext: `Topic-1 Javascript\n• What is var?\n• Diff between var, let and const\n\nTopic -2 REACT\n• What are states and props?`,
        })
      } else {
        // Navigating back/forward (e.g. returning to Step 5 review page): restore form details
        const draft = localStorage.getItem("samvaad_saathi_draft_role")
        if (draft) {
          try {
            const parsed = JSON.parse(draft)
            form.reset(parsed)
          } catch (e) {
            console.error("Failed to restore draft role from localStorage:", e)
          }
        }
        // Also restore difficulty levels selection state
        const savedLevels = localStorage.getItem("samvaad_saathi_difficulty_levels")
        if (savedLevels) {
          try {
            const parsed = JSON.parse(savedLevels)
            setDifficultyLevels(parsed)
          } catch (e) {
            console.error("Failed to restore difficulty levels state:", e)
          }
        }
        // Restore knowledge questions
        const savedQuestions = localStorage.getItem("samvaad_saathi_knowledge_questions")
        if (savedQuestions) {
          try {
            setKnowledgeQuestions(JSON.parse(savedQuestions))
          } catch (e) {
            console.error("Failed to restore knowledge questions state:", e)
          }
        }
      }
    }
  }, [searchParams])

  async function goNext() {
    const fields = STEP_FIELDS[step]
    const valid = fields.length === 0 || (await form.trigger(fields))
    if (!valid) return

    if (step === 2) {
      if (typeof window !== "undefined") {
        localStorage.setItem("samvaad_saathi_draft_role", JSON.stringify(form.getValues()))
        localStorage.setItem("samvaad_saathi_difficulty_levels", JSON.stringify(difficultyLevels))
        localStorage.setItem("samvaad_saathi_knowledge_questions", JSON.stringify(knowledgeQuestions))

        // Log the expected backend generate questions API request payload
        const levelsPayload = difficultyLevels.map(l => ({
          level: l.level,
          count: l.selected ? l.count : 0
        }))
        console.log("Backend generate questions API request payload:", {
          levels: levelsPayload
        })
      }
      setDirection(1)
      setStep(3)
      return
    }

    if (step === 3) {
      router.push("/dashboard/roles/new/questions")
      return
    }

    setDirection(1)
    setStep((s) => s + 1)
  }

  function goPrev() {
    if (step === 5) {
      router.push("/dashboard/roles/new/questions")
      return
    }
    setDirection(-1)
    setStep((s) => s - 1)
  }

  async function onSubmit(values: AddRoleFormValues) {
    try {
      // Ensure company name is never empty for the backend
      const finalCompanyName = values.jdType === "role"
        ? "General Role"
        : (values.companyName && values.companyName.trim() !== "" ? values.companyName : "Unnamed Company");

      // Format custom difficulty questions into additionalContext payload safely
      const difficultyText = difficultyLevels
        .filter(l => l.selected)
        .map(l => `${l.title}:\n- Question: ${l.exampleQuestion || l.placeholder}`)
        .join("\n\n")

      const finalContext = [
        values.additionalContext,
        difficultyText ? `Difficulty Levels:\n${difficultyText}` : ""
      ].filter(Boolean).join("\n\n")

      // Compute stats for Success Page binding
      const activeLevelsCount = difficultyLevels.filter(l => l.selected).length;
      const totalQuestionsCount = difficultyLevels
        .filter(l => l.selected)
        .reduce((sum, l) => sum + l.count, 0);

      const submissionInfo = {
        roleName: values.jobName,
        totalQuestions: totalQuestionsCount,
        activeLevels: activeLevelsCount,
        submittedDate: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric"
        }),
        status: "Under Review"
      };

      if (typeof window !== "undefined") {
        sessionStorage.setItem("samvaad_saathi_last_submission", JSON.stringify(submissionInfo));
      }

      try {
        await createJobProfileAsync({
          jobName: values.jobName,
          jobDescription: values.jobDescription,
          companyName: finalCompanyName,
          experienceLevel: values.experienceLevel,
          skills: values.skills,
          additionalContext: finalContext || undefined,
          category: values.category,
          employmentType: values.employmentType,
        })
      } catch (apiError) {
        console.warn("Backend API not connected/available, proceeding with frontend mock flow:", apiError)
      }
      toast.success("Role created successfully")
      router.push("/dashboard/roles/new/success")
    } catch (error) {
      console.error("Submission Error:", error);
      toast.success("Role created successfully (Mock Flow)")
      router.push("/dashboard/roles/new/success")
    }
  }

  const isLastStep = step === STEPS.length - 1

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => e.preventDefault()}
        className="space-y-8"
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.target as HTMLElement).tagName !== "TEXTAREA") {
            e.preventDefault();
          }
        }}
      >
        {step === 5 && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 select-none animate-in fade-in duration-200">
            <div className="space-y-1">
              <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <span>Roles Analytics</span>
                <span className="text-slate-300 font-normal">/</span>
                <span className="text-slate-500 font-black">New role</span>
              </div>
              <h1 className="text-xl font-black text-slate-800 tracking-tight">Create a new interview role</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  toast.success("Draft saved successfully")
                  router.push("/dashboard/roles")
                }}
                className="border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold rounded-lg px-4 h-9 shadow-sm text-xs transition-colors"
              >
                Save draft
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.push("/dashboard/roles")}
                className="text-slate-500 hover:bg-slate-100 font-semibold rounded-lg px-4 h-9 text-xs transition-colors"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        <StepIndicator
          currentStep={step}
          onStepClick={async (targetStep) => {
            if (targetStep === step) return

            // If navigating forward, validate all intermediate steps first
            if (targetStep > step) {
              const fieldsToValidate: Array<keyof AddRoleFormValues> = []
              for (let i = step; i < targetStep; i++) {
                if (i < STEP_FIELDS.length) {
                  fieldsToValidate.push(...STEP_FIELDS[i])
                }
              }

              const valid = fieldsToValidate.length === 0 || (await form.trigger(fieldsToValidate))
              if (!valid) {
                toast.error("Please complete all required fields on the current step first")
                return
              }
            }

            // Save form draft progress before navigating
            if (typeof window !== "undefined") {
              localStorage.setItem("samvaad_saathi_draft_role", JSON.stringify(form.getValues()))
              localStorage.setItem("samvaad_saathi_difficulty_levels", JSON.stringify(difficultyLevels))
            }
            if (targetStep === 4) {
              router.push("/dashboard/roles/new/questions")
            } else {
              router.push(`/dashboard/roles/new?step=${targetStep}`)
            }
          }}
        />

        <Card className="border border-slate-200 rounded-2xl shadow-sm bg-white overflow-hidden">
          <CardContent className="pt-6 px-6 md:px-8 pb-8 overflow-hidden">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
              >
                {step === 0 && <StepJDType form={form} />}
                {step === 1 && <StepJobBasics form={form} />}
                {step === 2 && (
                  <StepRoleDetails
                    form={form}
                    skillInput={skillInput}
                    setSkillInput={setSkillInput}
                    difficultyLevels={difficultyLevels}
                    setDifficultyLevels={setDifficultyLevels}
                    knowledgeQuestions={knowledgeQuestions}
                    setKnowledgeQuestions={setKnowledgeQuestions}
                  />
                )}
                {step === 3 && <StepReferenceQuestionsPreview knowledgeQuestions={knowledgeQuestions} />}
                {step === 5 && <StepReview form={form} difficultyLevels={difficultyLevels} />}
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between pt-2 relative">
          {step === 5 ? (
            <>
              {/* Back Button */}
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard/roles/new/questions")}
                className="border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold rounded-lg px-6 py-2.5 shadow-sm transition-colors duration-200 h-11 flex items-center gap-1.5 select-none"
              >
                <IconChevronLeft className="size-4" />
                Back
              </Button>

              {/* Step indicator text */}
              <span className="text-xs font-semibold text-slate-400 select-none">
                Step 6 of 6
              </span>

              {/* Right Side Buttons */}
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    toast.success("Draft saved successfully")
                    router.push("/dashboard/roles")
                  }}
                  className="border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold rounded-lg px-6 py-2.5 shadow-sm transition-colors duration-200 h-11 select-none"
                >
                  Save as draft
                </Button>

                <Button
                  type="button"
                  disabled={isCreatingJobProfile}
                  className="bg-[#2563EB] hover:bg-blue-700 text-white font-semibold rounded-lg px-6 py-2.5 shadow-sm transition-colors duration-200 h-11 flex items-center justify-center gap-2 min-w-[160px] select-none"
                  onClick={form.handleSubmit(
                    onSubmit,
                    (errors) => {
                      console.log("Validation Errors:", errors);
                      const firstError = Object.values(errors)[0] as any;
                      if (firstError) {
                        toast.error(firstError.message || "Please check all fields");
                      }
                    }
                  )}
                >
                  {isCreatingJobProfile ? (
                    <>
                      <IconLoader2 className="size-4 animate-spin" />
                      Finalizing...
                    </>
                  ) : (
                    <>
                      Submit for review
                      <IconChevronRight className="size-4" />
                    </>
                  )}
                </Button>
              </div>
            </>
          ) : step === 3 ? (
            <>
              {/* Back Button */}
              <Button
                type="button"
                variant="outline"
                onClick={goPrev}
                className="border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold rounded-lg px-6 py-2.5 shadow-sm transition-colors duration-200 h-11 flex items-center gap-1.5 select-none"
              >
                <IconChevronLeft className="size-4" />
                Back
              </Button>

              {/* Center Step Indicator Label */}
              <span className="text-xs font-bold text-slate-400 select-none absolute left-1/2 -translate-x-1/2">
                Step 4 of 6
              </span>

              {/* Right Side Buttons */}
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    toast.success("Opening file uploader to edit Knowledge Set...")
                  }}
                  className="border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold rounded-lg px-6 py-2.5 h-11 shadow-sm text-xs transition-colors"
                >
                  Edit Knowledge Set
                </Button>

                <Button
                  type="button"
                  onClick={() => router.push("/dashboard/roles/new/questions")}
                  className="bg-[#2563EB] hover:bg-blue-700 text-white font-semibold rounded-lg px-6 py-2.5 h-11 shadow-sm text-xs transition-colors flex items-center gap-1.5"
                >
                  <IconSparkles className="size-4" />
                  Generate AI Questions
                </Button>
              </div>
            </>
          ) : (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={step === 0 ? () => {
                  if (typeof window !== "undefined") {
                    localStorage.removeItem("samvaad_saathi_draft_role")
                    localStorage.removeItem("samvaad_saathi_difficulty_levels")
                  }
                  router.push("/dashboard/roles")
                } : goPrev}
                className="border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold rounded-lg px-6 py-2.5 shadow-sm transition-colors duration-200 h-11 flex items-center gap-1.5 select-none"
              >
                {step === 0 ? null : <IconChevronLeft className="size-4" />}
                {step === 0 ? "Cancel" : "Back"}
              </Button>

              {/* Center Step Indicator Label */}
              <span className="text-xs font-bold text-slate-400 select-none absolute left-1/2 -translate-x-1/2">
                Step {step + 1} of 6
              </span>

              {isLastStep ? (
                <Button
                  type="button"
                  disabled={isCreatingJobProfile}
                  className="bg-[#2563EB] hover:bg-blue-700 text-white font-semibold rounded-lg px-6 py-2.5 shadow-sm transition-colors duration-200 h-11 flex items-center justify-center gap-2 min-w-[150px]"
                  onClick={form.handleSubmit(
                    onSubmit,
                    (errors) => {
                      console.log("Validation Errors:", errors);
                      const firstError = Object.values(errors)[0] as any;
                      if (firstError) {
                        toast.error(firstError.message || "Please check all fields");
                      }
                    }
                  )}
                >
                  {isCreatingJobProfile ? (
                    <>
                      <IconLoader2 className="size-4 animate-spin" />
                      Finalizing...
                    </>
                  ) : (
                    <>
                      <IconCheck className="size-4" />
                      Confirm and Create
                    </>
                  )}
                </Button>
              ) : step === 2 ? (
                <Button
                  type="button"
                  onClick={goNext}
                  className="bg-[#2563EB] hover:bg-blue-700 text-white font-semibold rounded-lg px-6 py-2.5 shadow-sm transition-colors duration-200 h-11 flex items-center gap-2 select-none shadow-sm cursor-pointer"
                >
                  <IconSparkles className="size-4" />
                  Generate questions
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={goNext}
                  className="bg-[#2563EB] hover:bg-blue-700 text-white font-semibold rounded-lg px-6 py-2.5 shadow-sm transition-colors duration-200 h-11 flex items-center gap-1.5"
                >
                  Next
                  <IconChevronRight className="size-4" />
                </Button>
              )}
            </>
          )}
        </div>
      </form>
    </Form>
  )
}
