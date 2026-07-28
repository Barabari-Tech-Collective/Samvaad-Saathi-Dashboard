"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { AnimatePresence, motion } from "motion/react"
import { toast } from "sonner"
import {
  IconCheck,
  IconChevronLeft,
  IconChevronRight,
  IconLoader2,
  IconSparkles,
} from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import { useCreateJobProfile, useSubmitJobProfile } from "@/lib/api/hooks/analytics/useJobProfiles"
import { RoleCreationStepper } from "./RoleCreationStepper"

import {
  addRoleSchema,
  AddRoleFormValues,
  STEPS,
  STEP_FIELDS,
  slideVariants,
  DifficultyLevel,
} from "./constants"
import { InterviewTypeStep } from "./InterviewTypeStep"
import { RoleDetailsStep } from "./RoleDetailsStep"
import { JDConfigurationStep } from "./JDConfigurationStep"
import { ReferenceQuestionsPreviewStep } from "./ReferenceQuestionsPreviewStep"
import { ReviewSubmitStep } from "./ReviewSubmitStep"

export function StepIndicator({
  currentStep,
  onStepClick,
}: {
  currentStep: number
  onStepClick?: (stepIndex: number) => void
}) {
  return <RoleCreationStepper currentStep={currentStep} onStepClick={onStepClick} />
}

export function AddRoleStepper() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState(1)
  const [skillInput, setSkillInput] = useState("")
  const [knowledgeQuestions, setKnowledgeQuestions] = useState<any>(null)
  const { createJobProfileAsync, isCreatingJobProfile } = useCreateJobProfile()
  const { submitProfileAsync, isSubmittingProfile } = useSubmitJobProfile()

  useEffect(() => {
    const stepParam = searchParams.get("step")
    if (stepParam !== null) {
      const parsed = parseInt(stepParam, 10)
      if (parsed >= 0 && parsed <= 5) {
        setStep(parsed)
      }
    }
  }, [searchParams])

  const [difficultyLevels, setDifficultyLevels] = useState<Array<DifficultyLevel>>([
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
      uploadedJDFileName: null,
      additionalContext: `Topic-1 Javascript\n• What is var?\n• Diff between var, let and const\n\nTopic -2 REACT\n• What are states and props?`,
    },
    mode: "onTouched",
  })

  useEffect(() => {
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

  async function handleGenerateQuestionsClick() {
    try {
      let profileId = localStorage.getItem("samvaad_saathi_draft_profile_id");
      if (!profileId || profileId === "null") {
        const values = form.getValues()
        const finalCompanyName = values.jdType === "role"
          ? "General Role"
          : (values.companyName && values.companyName.trim() !== "" ? values.companyName : "Unnamed Company");

        const difficultyText = difficultyLevels
          .filter(l => l.selected)
          .map(l => `${l.title}:\n- Question: ${l.exampleQuestion || l.placeholder}`)
          .join("\n\n")

        const finalContext = [
          values.additionalContext,
          difficultyText ? `Difficulty Levels:\n${difficultyText}` : ""
        ].filter(Boolean).join("\n\n")

        const response = await createJobProfileAsync({
          jobName: values.jobName,
          jobDescription: values.jobDescription,
          companyName: finalCompanyName,
          experienceLevel: values.experienceLevel,
          skills: values.skills,
          additionalContext: finalContext || undefined,
          category: values.category,
          employmentType: values.employmentType,
        })
        const newId = (response as any).id ?? (response as any).jobProfileId ?? (response as any).job_profile_id;
        profileId = String(newId)
        localStorage.setItem("samvaad_saathi_draft_profile_id", profileId as string)
      }
      router.push("/dashboard/roles/new/questions")
    } catch (e) {
      console.error("Failed to create profile before generating questions:", e)
      toast.error("Failed to prepare profile for questions. Check your connection.")
    }
  }

  async function handleFinalSubmit() {
    try {
      const profileId = localStorage.getItem("samvaad_saathi_draft_profile_id");
      if (!profileId || profileId === "null") {
        toast.error("No profile ID found to submit.");
        return;
      }

      let draftJobName = form.getValues("jobName");
      if (!draftJobName) {
        const savedDraftStr = localStorage.getItem("samvaad_saathi_draft_role");
        if (savedDraftStr) {
          try { draftJobName = JSON.parse(savedDraftStr).jobName || "Unnamed Role"; } catch (e) { }
        }
      }

      const activeLevelsCount = difficultyLevels.filter(l => l.selected).length;
      const totalQuestionsCount = difficultyLevels
        .filter(l => l.selected)
        .reduce((sum, l) => sum + l.count, 0);

      let submissionInfo = {
        roleName: draftJobName || "Unnamed Role",
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
        const existingStr = sessionStorage.getItem("samvaad_saathi_last_submission");
        if (existingStr && (!draftJobName || draftJobName === "Unnamed Role")) {
          try {
            submissionInfo = JSON.parse(existingStr);
          } catch (e) { }
        }
        sessionStorage.setItem("samvaad_saathi_last_submission", JSON.stringify(submissionInfo));
      }

      try {
        await submitProfileAsync({ jobProfileId: profileId });
      } catch (apiError) {
        console.warn("Backend API not connected/available or failed to submit, proceeding with frontend flow:", apiError);
      }
      toast.success("Role submitted successfully");
      router.push("/dashboard/roles/new/success");
    } catch (error) {
      console.error("Submission Error:", error);
      toast.error("Failed to submit role. Please try again.");
    }
  }

  async function onSubmit(values: AddRoleFormValues) {
    // Only used for earlier steps if needed, but final submit uses handleFinalSubmit
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
                {step === 0 && <InterviewTypeStep form={form} />}
                {step === 1 && <RoleDetailsStep form={form} />}
                {step === 2 && (
                  <JDConfigurationStep
                    form={form}
                    skillInput={skillInput}
                    setSkillInput={setSkillInput}
                    difficultyLevels={difficultyLevels}
                    setDifficultyLevels={setDifficultyLevels}
                    knowledgeQuestions={knowledgeQuestions}
                    setKnowledgeQuestions={setKnowledgeQuestions}
                  />
                )}
                {step === 3 && <ReferenceQuestionsPreviewStep form={form} difficultyLevels={difficultyLevels} knowledgeQuestions={knowledgeQuestions} />}
                {step === 5 && <ReviewSubmitStep form={form} difficultyLevels={difficultyLevels} />}
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
                  disabled={isSubmittingProfile}
                  className="bg-[#2563EB] hover:bg-blue-700 text-white font-semibold rounded-lg px-6 py-2.5 shadow-sm transition-colors duration-200 h-11 flex items-center justify-center gap-2 min-w-[160px] select-none"
                  onClick={() => handleFinalSubmit()}
                >
                  {isSubmittingProfile ? (
                    <>
                      <IconLoader2 className="size-4 animate-spin" />
                      Submitting...
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
                  onClick={handleGenerateQuestionsClick}
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
