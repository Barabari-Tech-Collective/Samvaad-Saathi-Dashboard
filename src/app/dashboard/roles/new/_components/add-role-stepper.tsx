"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
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
import { useCreateJobProfile } from "@/lib/api/hooks/analytics/useJobProfiles"
import { cn } from "@/lib/utils"

const addRoleSchema = z.object({
  jdType: z.enum(["company", "role"], {
    message: "Please select a JD type",
  }),
  jobName: z.string().min(2, "Job name must be at least 2 characters"),
  companyName: z.string().optional(), // Now optional depending on type
  experienceLevel: z.enum(["fresher", "junior", "mid", "senior", "expert"], {
    message: "Select an experience level",
  }),
  jobDescription: z.string().min(10, "Description must be at least 10 characters"),
  skills: z.array(z.string().min(1)).min(1, "Add at least one skill"),
  additionalContext: z.string().optional(),
})

type AddRoleFormValues = z.infer<typeof addRoleSchema>

const STEPS = [
  { label: "JD Type", icon: IconSettings },
  { label: "Job Basics", icon: IconBriefcase },
  { label: "Role Details", icon: IconListDetails },
  { label: "Review", icon: IconNotes },
]

const STEP_FIELDS: Array<Array<keyof AddRoleFormValues>> = [
  ["jdType"],
  ["jobName", "companyName", "experienceLevel"],
  ["jobDescription", "skills"],
  [],
]

const EXPERIENCE_LEVELS = [
  { value: "fresher", label: "Fresher" },
  { value: "junior", label: "Junior" },
  { value: "mid", label: "Mid-level" },
  { value: "senior", label: "Senior" },
  { value: "expert", label: "Expert" },
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

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-start gap-0">
      {STEPS.map((step, index) => {
        const Icon = step.icon
        const isDone = index < currentStep
        const isActive = index === currentStep
        return (
          <React.Fragment key={step.label}>
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all duration-300",
                  isDone &&
                  "border-primary bg-primary text-primary-foreground",
                  isActive &&
                  "border-primary bg-background text-primary shadow-sm",
                  !isDone &&
                  !isActive &&
                  "border-border bg-background text-muted-foreground",
                )}
              >
                {isDone ? (
                  <IconCheck className="size-4" />
                ) : (
                  <Icon className="size-4" />
                )}
              </div>
              <span
                className={cn(
                  "text-xs font-medium whitespace-nowrap",
                  isActive ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {step.label}
              </span>
            </div>
            {index < STEPS.length - 1 && (
              <div
                className={cn(
                  "mt-4 h-px flex-1 min-w-12 transition-colors duration-300",
                  index < currentStep ? "bg-primary" : "bg-border",
                )}
              />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
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
    <div className="space-y-5">
      <div className="flex items-center gap-3 pb-2 mb-2 border-b">
        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 capitalize px-2 py-0.5">
          {jdType === "company" ? "Company Specific" : "Role Specific"}
        </Badge>
        <span className="text-xs text-muted-foreground">Type selected</span>
      </div>
      <div>
        <h2 className="text-base font-semibold">Job Basics</h2>
        <p className="text-sm text-muted-foreground">
          Core details about the role and company.
        </p>
      </div>
      <div className={cn("grid gap-4", jdType === "company" ? "sm:grid-cols-2" : "grid-cols-1")}>
        <FormField
          control={form.control}
          name="jobName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. HR and Communications Interview" className="h-12 px-4 text-base" {...field} />
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
      <FormField
        control={form.control}
        name="experienceLevel"
        render={({ field }) => (
          <FormItem className="max-w-sm">
            <FormLabel>Experience Level</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger className="h-12 px-4 text-base">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {EXPERIENCE_LEVELS.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}

function StepRoleDetails({
  form,
  skillInput,
  setSkillInput,
  difficultyLevels,
  setDifficultyLevels,
}: {
  form: ReturnType<typeof useForm<AddRoleFormValues>>
  skillInput: string
  setSkillInput: (v: string) => void
  difficultyLevels: Array<{
    level: number
    selected: boolean
    title: string
    description: string
    exampleQuestion: string
    placeholder: string
  }>
  setDifficultyLevels: React.Dispatch<React.SetStateAction<Array<{
    level: number
    selected: boolean
    title: string
    description: string
    exampleQuestion: string
    placeholder: string
  }>>>
}) {
  const skills = form.watch("skills")
  const [isExtractorOpen, setIsExtractorOpen] = React.useState(false)

  const suggestedSkills = [
    "Full Stack Development", "React.js", "Next.js", "PostgreSQL", "MongoDB",
    "JavaScript (ES6+)", "TypeScript", "CSS3", "Tailwind CSS", "RESTful APIs",
    "GraphQL", "Redux", "JSON Web Token (JWT)", "Git/GitHub", "AWS", "Vercel", "Docker"
  ]

  function toggleExtractor() {
    setIsExtractorOpen((prev) => !prev)
    if (!isExtractorOpen) {
      toast.success("Skills suggested from description")
    }
  }

  function toggleSkillSelection(skill: string) {
    const current = form.getValues("skills")
    if (current.includes(skill)) {
      form.setValue("skills", current.filter((s) => s !== skill), { shouldValidate: true })
    } else {
      form.setValue("skills", [...current, skill], { shouldValidate: true })
    }
  }

  function addSkill(raw: string) {
    const trimmed = raw.trim().replace(/,$/, "").trim()
    if (!trimmed) return
    const current = form.getValues("skills")
    if (current.includes(trimmed)) {
      setSkillInput("")
      return
    }
    form.setValue("skills", [...current, trimmed], { shouldValidate: true })
    setSkillInput("")
  }

  function removeSkill(skill: string) {
    form.setValue(
      "skills",
      form.getValues("skills").filter((s) => s !== skill),
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

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="pb-4 border-b border-slate-100">
        <h2 className="text-xl font-bold tracking-tight text-slate-800">
          Step - 3 Job Description & Set Difficulty Levels
        </h2>
      </div>

      {/* Job Description Textarea */}
      <FormField
        control={form.control}
        name="jobDescription"
        render={({ field }) => (
          <FormItem className="space-y-1.5">
            <FormLabel className="text-sm font-semibold text-slate-800">
              Job Description <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <div className="space-y-2">
                <Textarea
                  placeholder="e.g., Frontend Developer"
                  className="min-h-36 w-full border border-slate-200 rounded-lg p-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none shadow-sm placeholder:text-slate-400 leading-relaxed bg-white transition-all"
                  {...field}
                />
                
                {/* Error message placed directly below the textarea and above Extract Skills */}
                <FormMessage />

                {/* Extract Skills Button/Link */}
                <div className="flex items-center gap-1 pt-1">
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    className="h-auto p-0 text-[#2563EB] hover:text-blue-700 font-semibold text-xs flex items-center gap-1.5 cursor-pointer"
                    onClick={toggleExtractor}
                  >
                    <IconSparkles className="size-3.5 text-blue-600 animate-pulse" />
                    Extract Skills
                  </Button>
                </div>
              </div>
            </FormControl>
          </FormItem>
        )}
      />

      {/* Job Description Upload Button (Directly below JD section, styled exactly like the Knowledge Base one) */}
      <div className="pt-1">
        <button
          type="button"
          onClick={() => {
            toast.success("Job Description PDF/DOC uploaded successfully!")
          }}
          className="inline-flex items-center gap-2 border border-[#2563EB] hover:bg-blue-50 text-[#2563EB] text-xs font-semibold px-4 py-2.5 rounded-lg shadow-sm cursor-pointer transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-4 h-4 text-[#2563EB]"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
            />
          </svg>
          Upload Job Description (PDF/DOC)
        </button>
      </div>

      {/* Suggested & Extracted Skills Section */}
      {isExtractorOpen && (
        <div className="space-y-6 pt-4 border-t border-slate-100 animate-in fade-in duration-300">
          {/* 1. Suggested Skills */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
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
                      "cursor-pointer transition-all duration-200 px-3 py-1 text-xs font-semibold rounded-full border-none",
                      isSelected
                        ? "bg-blue-100 text-blue-700 ring-1 ring-blue-300"
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
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
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
                      {skills.map((skill) => (
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
                        className="min-w-[150px] flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400 border-none ring-0 p-0"
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

      {/* Set Difficulty Levels Section */}
      <div className="space-y-4 pt-4 border-t border-slate-100">
        <div>
          <h3 className="text-base font-extrabold text-slate-800">Set Difficulty Levels</h3>
          <p className="text-xs text-slate-400">
            Select which difficulty levels to include in this assessment.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3.5">
          {difficultyLevels.map((level, index) => {
            const isSelected = level.selected
            return (
              <div
                key={level.level}
                className={cn(
                  "border rounded-xl p-4 transition-all duration-200 bg-white border-slate-200 shadow-sm"
                )}
              >
                {/* Title & Checkbox */}
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={(checked) => {
                      const updated = [...difficultyLevels]
                      updated[index] = { ...updated[index], selected: checked as boolean }
                      setDifficultyLevels(updated)
                    }}
                    className="mt-1.5 h-4.5 w-4.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <div className="flex-1 space-y-0.5">
                    <div className="font-bold text-slate-800 text-sm">{level.title}</div>
                    <div className="text-xs text-slate-500 leading-normal">{level.description}</div>
                  </div>
                </div>

                {/* Custom Input (Always Visible) */}
                <div className="mt-3">
                  <input
                    type="text"
                    value={level.exampleQuestion}
                    onChange={(e) => {
                      const updated = [...difficultyLevels]
                      updated[index] = { ...updated[index], exampleQuestion: e.target.value }
                      if (e.target.value.trim() !== "") {
                        updated[index].selected = true
                      }
                      setDifficultyLevels(updated)
                    }}
                    placeholder={level.placeholder}
                    className="w-full bg-[#EFF6FF] border border-[#E0EEFF] text-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-sm placeholder:text-slate-400 font-medium"
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Knowledge Set Questions Section */}
      <div className="space-y-4 pt-4 border-t border-slate-100">
        <FormField
          control={form.control}
          name="additionalContext"
          render={({ field }) => (
            <FormItem className="space-y-1.5">
              <FormLabel className="text-sm font-semibold text-slate-800">
                Knowledge Set Questions <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="e.g. Topic-1 Javascript"
                  className="min-h-[140px] w-full border border-slate-200 rounded-lg p-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none shadow-sm font-mono text-xs text-slate-700 bg-slate-50/20 leading-relaxed"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Knowledge Set Questions Upload Button */}
      <div className="pt-1">
        <button
          type="button"
          onClick={() => {
            toast.success("Knowledge Set Questions PDF/DOC uploaded successfully!")
          }}
          className="inline-flex items-center gap-2 border border-[#2563EB] hover:bg-blue-50 text-[#2563EB] text-xs font-semibold px-4 py-2.5 rounded-lg shadow-sm cursor-pointer transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-4 h-4 text-[#2563EB]"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
            />
          </svg>
          Upload Knowledge Set Questions (PDF/DOC)
        </button>
      </div>
    </div>
  )
}

function StepReview({ form }: { form: ReturnType<typeof useForm<AddRoleFormValues>> }) {
  const values = form.watch()
  const expLabel =
    EXPERIENCE_LEVELS.find((l) => l.value === values.experienceLevel)?.label ??
    values.experienceLevel

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold">Review Role Details</h2>
          <p className="text-sm text-muted-foreground">
            Please confirm the information below. This role has <b>not</b> been created yet.
          </p>
        </div>
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 gap-1.5 px-3 py-1">
          <div className="size-1.5 rounded-full bg-yellow-500 animate-pulse" />
          Draft / Preview
        </Badge>
      </div>

      <div className="space-y-3 rounded-lg border border-dashed border-muted-foreground/30 bg-muted/10 p-5 text-sm">
        <ReviewRow
          label="JD Type"
          value={values.jdType === "company" ? "Company Specific" : "Role Specific"}
        />
        <ReviewRow label="Job Name" value={values.jobName} />
        {values.jdType === "company" && (
          <ReviewRow label="Company" value={values.companyName} />
        )}
        <ReviewRow label="Experience Level" value={expLabel} />
        <ReviewRow label="Description" value={values.jobDescription} multiline />
        <div className="flex gap-4">
          <span className="w-36 shrink-0 font-medium text-muted-foreground">Skills</span>
          <div className="flex flex-wrap gap-1">
            {values.skills.map((skill) => (
              <Badge key={skill} variant="secondary">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
        {values.additionalContext && (
          <ReviewRow
            label="Additional Context"
            value={values.additionalContext}
            multiline
          />
        )}
      </div>

      <div className="rounded-md bg-blue-50 p-3 text-xs text-blue-700 border border-blue-100 flex items-start gap-2">
        <IconNotes className="size-4 shrink-0 mt-0.5" />
        <p>
          Click <b>"Confirm and Create"</b> below to finalize this role. Once created, it will appear in your Roles dashboard.
        </p>
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
  const [step, setStep] = React.useState(0)
  const [direction, setDirection] = React.useState(1)
  const [skillInput, setSkillInput] = React.useState("")
  const { createJobProfileAsync, isCreatingJobProfile } = useCreateJobProfile()

  const [difficultyLevels, setDifficultyLevels] = React.useState([
    {
      level: 1,
      selected: false,
      title: "Level - 1 General Fundamentals",
      description: "Easy conceptual questions to assess basic understanding",
      exampleQuestion: "",
      placeholder: "e.g., What is the difference between let and const in JS?",
    },
    {
      level: 2,
      selected: false,
      title: "Level - 2 Project & Resume Based",
      description: "Scenario driven questions with follow ups on past work",
      exampleQuestion: "",
      placeholder: "e.g., Tell me about a challenging project you worked on?",
    },
    {
      level: 3,
      selected: false,
      title: "Level - 3 Production & Scenario Based",
      description: "Real world implementation & problem solving",
      exampleQuestion: "",
      placeholder: "e.g., How would you optimize a slow loading REACT component?",
    },
    {
      level: 4,
      selected: false,
      title: "Level - 4 Advanced",
      description: "Complex Production decision-making under constraints",
      exampleQuestion: "",
      placeholder: "e.g., How would you optimize a slow loading REACT component?",
    },
  ])

  const form = useForm<AddRoleFormValues>({
    resolver: zodResolver(addRoleSchema),
    defaultValues: {
      jdType: undefined,
      jobName: "",
      companyName: "",
      experienceLevel: undefined,
      jobDescription: "",
      skills: [],
      additionalContext: `Topic-1 Javascript\n• What is var?\n• Diff between var, let and const\n\nTopic -2 REACT\n• What are states and props?`,
    },
    mode: "onTouched",
  })

  async function goNext() {
    const fields = STEP_FIELDS[step]
    const valid = fields.length === 0 || (await form.trigger(fields))
    if (!valid) return
    setDirection(1)
    setStep((s) => s + 1)
  }

  function goPrev() {
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

      await createJobProfileAsync({
        jobName: values.jobName,
        jobDescription: values.jobDescription,
        companyName: finalCompanyName,
        experienceLevel: values.experienceLevel,
        skills: values.skills,
        additionalContext: finalContext || undefined,
      })
      toast.success("Role created successfully")
      router.push("/dashboard/roles")
    } catch (error) {
      console.error("API Error:", error);
      toast.error("Failed to create role. The backend might be unavailable.");
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
        <StepIndicator currentStep={step} />

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
                  />
                )}
                {step === 3 && <StepReview form={form} />}
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={step === 0 ? () => router.push("/dashboard/roles") : goPrev}
            className="border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold rounded-lg px-6 py-2.5 shadow-sm transition-colors duration-200 h-11 flex items-center gap-1.5"
          >
            <IconChevronLeft className="size-4" />
            {step === 0 ? "Cancel" : "Back"}
          </Button>

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
        </div>
      </form>
    </Form>
  )
}
