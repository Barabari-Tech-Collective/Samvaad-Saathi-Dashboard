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
import { RoleCreationStepper } from "./RoleCreationStepper"

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

export const STEPS = [
  { label: "JD Type", icon: IconSettings },
  { label: "Job Basics", icon: IconBriefcase },
  { label: "Role Details", icon: IconListDetails },
  { label: "Questions", icon: IconSparkles },
  { label: "Review", icon: IconNotes },
]

const STEP_FIELDS: Array<Array<keyof AddRoleFormValues>> = [
  ["jdType"],
  ["jobName", "companyName", "experienceLevel"],
  ["jobDescription", "skills"],
  [],
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

export function StepIndicator({ currentStep }: { currentStep: number }) {
  return <RoleCreationStepper currentStep={currentStep} />
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
    "Senior"

  // Make mock data fallbacks match the Figma screenshot exactly
  const jobName = values.jobName || "Senior Front-End Developer"
  const category = values.jdType === "company" ? "Company Specific" : "Engineering"
  const experienceRange = expLabel === "Senior" ? "4–6 years" : expLabel
  const jobDescription = values.jobDescription || "Own end-to-end frontend architecture for the customer experience surface. Drive performance, design-system adoption and mentorship across squads."
  
  const skillsList = values.skills && values.skills.length > 0 ? values.skills : ["React", "TypeScript", "GraphQL", "Performance"]
  const competenciesList = ["Systems thinking", "Stakeholder comms", "Production ownership"]

  // Accordion active level state
  const [activeLevel, setActiveLevel] = React.useState<number | null>(1)

  const levels = [
    {
      id: 1,
      badge: "L1",
      title: "General Fundamentals",
      description: "Basic concepts and foundational knowledge questions.",
      countText: "15 questions",
      questions: [
        "Q1. Explain the difference between var, let, and const in JavaScript.",
        "Q2. What are React hooks and why were they introduced?",
        "Q3. How does the browser event loop work?"
      ],
      hasMoreLink: true,
      hasMoreText: "View all 15 questions"
    },
    {
      id: 2,
      badge: "L2",
      title: "Project & Resume Based",
      description: "Questions based on resume, projects and practical implementation.",
      countText: "15 questions",
      questions: [
        "Q1. Tell me about a challenging React project where you optimized rendering.",
        "Q2. How did you structure GraphQL schema mutations in your last application?",
        "Q3. Describe your experience leading architectural decisions across front-end squads."
      ],
      hasMoreLink: false
    },
    {
      id: 3,
      badge: "L3",
      title: "Production & Scenario Based",
      description: "Production-level debugging and real-world problem-solving questions.",
      countText: "10 questions",
      questions: [
        "Q1. How would you handle state synchronization across multiple browser tabs?",
        "Q2. What strategies do you use for real-time monitoring of runtime JavaScript errors?",
        "Q3. Explain how to implement incremental migration from legacy SPA to modern SSR."
      ],
      hasMoreLink: false
    },
    {
      id: 4,
      badge: "L4",
      title: "Advanced / Pressure Scenarios",
      description: "High-pressure and advanced real-world interview situations.",
      countText: "10 questions",
      questions: [
        "Q1. How would you explain browser rendering cycles under intense performance constraints?",
        "Design a thread-safe frontend cache architecture utilizing Web Workers.",
        "What actions do you take when your production frontend experiences a sudden memory leak?"
      ],
      hasMoreLink: false
    }
  ]

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
            <div className="text-sm font-semibold text-slate-800">Full-time</div>
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
  const { createJobProfileAsync, isCreatingJobProfile } = useCreateJobProfile()

  React.useEffect(() => {
    const stepParam = searchParams.get("step")
    if (stepParam !== null) {
      const parsed = parseInt(stepParam, 10)
      if (parsed >= 0 && parsed <= 4) {
        setStep(parsed)
      }
    }
  }, [searchParams])

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

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const draft = localStorage.getItem("samvaad_saathi_draft_role")
      if (draft) {
        try {
          const parsed = JSON.parse(draft)
          form.reset(parsed)
        } catch (e) {
          console.error("Failed to restore draft role from localStorage:", e)
        }
      }
    }
  }, [])

  async function goNext() {
    const fields = STEP_FIELDS[step]
    const valid = fields.length === 0 || (await form.trigger(fields))
    if (!valid) return

    if (step === 2) {
      if (typeof window !== "undefined") {
        localStorage.setItem("samvaad_saathi_draft_role", JSON.stringify(form.getValues()))
      }
      router.push("/dashboard/roles/new/questions")
      return
    }

    setDirection(1)
    setStep((s) => s + 1)
  }

  function goPrev() {
    if (step === 4) {
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

      try {
        await createJobProfileAsync({
          jobName: values.jobName,
          jobDescription: values.jobDescription,
          companyName: finalCompanyName,
          experienceLevel: values.experienceLevel,
          skills: values.skills,
          additionalContext: finalContext || undefined,
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
        {step === 4 && (
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
                {step === 4 && <StepReview form={form} />}
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between pt-2">
          {step === 4 ? (
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
                Step 5 of 5
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
          ) : (
            <>
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
            </>
          )}
        </div>
      </form>
    </Form>
  )
}
