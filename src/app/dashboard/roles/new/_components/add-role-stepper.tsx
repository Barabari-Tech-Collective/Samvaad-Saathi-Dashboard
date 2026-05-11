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

  const form = useForm<AddRoleFormValues>({
    resolver: zodResolver(addRoleSchema),
    defaultValues: {
      jdType: undefined,
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
      // Ensure company name is never empty for the backend
      const finalCompanyName = values.jdType === "role"
        ? "General Role"
        : (values.companyName && values.companyName.trim() !== "" ? values.companyName : "Unnamed Company");

      await createJobProfileAsync({
        jobName: values.jobName,
        jobDescription: values.jobDescription,
        companyName: finalCompanyName,
        experienceLevel: values.experienceLevel,
        skills: values.skills,
        additionalContext: values.additionalContext || undefined,
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
                {step === 0 && <StepJDType form={form} />}
                {step === 1 && <StepJobBasics form={form} />}
                {step === 2 && (
                  <StepRoleDetails
                    form={form}
                    skillInput={skillInput}
                    setSkillInput={setSkillInput}
                  />
                )}
                {step === 3 && <StepReview form={form} />}
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
            <Button
              type="button"
              disabled={isCreatingJobProfile}
              className="bg-primary text-primary-foreground hover:bg-primary/90 min-w-[140px]"
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
              className="min-w-[100px]"
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
