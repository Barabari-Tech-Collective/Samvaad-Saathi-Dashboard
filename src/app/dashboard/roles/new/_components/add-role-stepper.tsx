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
  IconCheck,
  IconChevronLeft,
  IconChevronRight,
  IconListDetails,
  IconLoader2,
  IconNotes,
  IconX,
} from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
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
  jobName: z.string().min(2, "Job name must be at least 2 characters"),
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  experienceLevel: z.enum(["fresher", "junior", "mid", "senior", "expert"], {
    message: "Select an experience level",
  }),
  jobDescription: z.string().min(10, "Description must be at least 10 characters"),
  skills: z.array(z.string().min(1)).min(1, "Add at least one skill"),
  additionalContext: z.string().optional(),
})

type AddRoleFormValues = z.infer<typeof addRoleSchema>

const STEPS = [
  { label: "Job Basics", icon: IconBriefcase },
  { label: "Role Details", icon: IconListDetails },
  { label: "Review", icon: IconNotes },
]

const STEP_FIELDS: Array<Array<keyof AddRoleFormValues>> = [
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

function StepJobBasics({ form }: { form: ReturnType<typeof useForm<AddRoleFormValues>> }) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-base font-semibold">Job Basics</h2>
        <p className="text-sm text-muted-foreground">
          Core details about the role and company.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
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
}: {
  form: ReturnType<typeof useForm<AddRoleFormValues>>
  skillInput: string
  setSkillInput: (v: string) => void
}) {
  const skills = form.watch("skills")

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
    <div className="space-y-5">
      <div>
        <h2 className="text-base font-semibold">Role Details</h2>
        <p className="text-sm text-muted-foreground">
          Describe the role and required skills.
        </p>
      </div>
      <FormField
        control={form.control}
        name="jobDescription"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Job Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe the role, what will be assessed, and any specific focus areas..."
                className="min-h-40 px-4 py-3 text-base resize-none"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="skills"
        render={() => (
          <FormItem>
            <FormLabel>Skills</FormLabel>
            <FormControl>
              <div className="flex min-h-12 flex-wrap items-center gap-1.5 rounded-md border border-input bg-background px-4 py-3 text-base focus-within:ring-1 focus-within:ring-ring">
                {skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="gap-1 pr-1">
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="rounded-sm opacity-60 hover:opacity-100"
                    >
                      <IconX className="size-3" />
                    </button>
                  </Badge>
                ))}
                <input
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onBlur={() => addSkill(skillInput)}
                  placeholder={skills.length === 0 ? "Type a skill and press Enter..." : "Add more..."}
                  className="min-w-[120px] flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
                />
              </div>
            </FormControl>
            <FormDescription>Press Enter or comma to add each skill.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="additionalContext"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Additional Context{" "}
              <span className="text-muted-foreground font-normal">(optional)</span>
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder="Any extra context for question generation..."
                className="min-h-28 px-4 py-3 text-base resize-none"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
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
      <div>
        <h2 className="text-base font-semibold">Review</h2>
        <p className="text-sm text-muted-foreground">
          Confirm details before creating the role.
        </p>
      </div>
      <div className="space-y-3 rounded-lg border bg-muted/30 p-4 text-sm">
        <ReviewRow label="Job Name" value={values.jobName} />
        <ReviewRow label="Company" value={values.companyName} />
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

  const form = useForm<AddRoleFormValues>({
    resolver: zodResolver(addRoleSchema),
    defaultValues: {
      jobName: "",
      companyName: "",
      experienceLevel: undefined,
      jobDescription: "",
      skills: [],
      additionalContext: "",
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
      await createJobProfileAsync({
        jobName: values.jobName,
        jobDescription: values.jobDescription,
        companyName: values.companyName,
        experienceLevel: values.experienceLevel,
        skills: values.skills,
        additionalContext: values.additionalContext || undefined,
      })
      toast.success("Role created successfully")
      router.push("/dashboard/roles")
    } catch {
      toast.error("Failed to create role. Please try again.")
    }
  }

  const isLastStep = step === STEPS.length - 1

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <StepIndicator currentStep={step} />

        <Card>
          <CardContent className="pt-6 overflow-hidden">
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
                {step === 0 && <StepJobBasics form={form} />}
                {step === 1 && (
                  <StepRoleDetails
                    form={form}
                    skillInput={skillInput}
                    setSkillInput={setSkillInput}
                  />
                )}
                {step === 2 && <StepReview form={form} />}
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={step === 0 ? () => router.push("/dashboard/roles") : goPrev}
          >
            <IconChevronLeft className="size-4" />
            {step === 0 ? "Cancel" : "Back"}
          </Button>

          {isLastStep ? (
            <Button type="submit" disabled={isCreatingJobProfile}>
              {isCreatingJobProfile && <IconLoader2 className="size-4 animate-spin" />}
              {isCreatingJobProfile ? "Creating..." : "Create Role"}
            </Button>
          ) : (
            <Button type="button" onClick={goNext}>
              Next
              <IconChevronRight className="size-4" />
            </Button>
          )}
        </div>
      </form>
    </Form>
  )
}
