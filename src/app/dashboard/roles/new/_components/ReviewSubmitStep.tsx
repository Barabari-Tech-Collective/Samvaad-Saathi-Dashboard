import { useState, useEffect } from "react"
import { UseFormReturn } from "react-hook-form"
import { toast } from "sonner"
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react"
import { IconLoader2 } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  AddRoleFormValues,
  DifficultyLevel,
  CATEGORY_OPTIONS,
  EMPLOYMENT_OPTIONS,
  EXPERIENCE_OPTIONS,
} from "./constants"
import { useGetJobProfileReview } from "@/lib/api/hooks/analytics/useJobProfiles"

interface ReviewSubmitStepProps {
  form: UseFormReturn<AddRoleFormValues>
  difficultyLevels: Array<DifficultyLevel>
}

export function ReviewSubmitStep({
  form,
  difficultyLevels,
}: ReviewSubmitStepProps) {
  const [isMounted, setIsMounted] = useState(false)
  const profileId = typeof window !== "undefined" ? localStorage.getItem("samvaad_saathi_draft_profile_id") : null

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const { reviewData, isLoadingReview } = useGetJobProfileReview(profileId)

  // Accordion active level state
  const [activeLevel, setActiveLevel] = useState<number | null>(1)
  const [expandedQuestionLevels, setExpandedQuestionLevels] = useState<number[]>([])

  if (!isMounted) return null

  if (isLoadingReview || !reviewData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-500">
        <IconLoader2 className="w-8 h-8 animate-spin mb-4 text-blue-600" />
        <p className="text-sm font-medium">Loading review summary...</p>
      </div>
    )
  }

  const { roleDetails, jdSummary, questionSummary } = reviewData

  const formValues = form.getValues()

  const jobName = roleDetails?.roleName || formValues.jobName || "New Role"
  const category = roleDetails?.category || formValues.category || "Engineering"
  const experienceRange = roleDetails?.experienceLevel || formValues.experienceLevel || "Not specified"
  const employmentType = roleDetails?.employmentType || formValues.employmentType || "Full-time"
  const jobDescription = roleDetails?.description || formValues.jobDescription || formValues.uploadedJDText || "No description provided."

  const skillsList = jdSummary?.extractedSkills?.length ? jdSummary.extractedSkills : (formValues.skills || [])
  const competenciesList = jdSummary?.competencies || []

  const levels = (questionSummary?.levels || []).map((level: any) => {
    const mockQuestions = level.previewQuestions?.map((q: any) => q.question) || []
    
    return {
      id: level.level,
      badge: `L${level.level}`,
      title: level.title,
      description: level.description,
      countText: `${level.questionCount} questions`,
      questions: mockQuestions,
      hasMoreLink: true,
      hasMoreText: `View all ${level.questionCount} questions`
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
          {/* <div className="space-y-3">
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
          </div> */}
        </div>
      </div>

      {/* 3. QUESTION OVERVIEW Card */}
      <div className="border border-slate-200 rounded-2xl p-6 bg-white shadow-sm space-y-5 animate-in fade-in duration-300">
        <div className="flex items-center justify-between select-none">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Question Overview
          </h3>
          <span className="text-xs font-semibold text-slate-400">
            {questionSummary?.totalQuestions || 0} questions across {questionSummary?.totalLevels || 0} levels
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
                      {level.questions.slice(0, expandedQuestionLevels.includes(level.id) ? undefined : 3).map((qText: string, qIdx: number) => (
                        <div
                          key={qIdx}
                          className="p-3 bg-slate-50/50 hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-700 transition-colors border border-slate-100"
                        >
                          {qText}
                        </div>
                      ))}
                    </div>

                    {level.hasMoreLink && !expandedQuestionLevels.includes(level.id) && level.questions.length > 3 && (
                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            setExpandedQuestionLevels(prev => [...prev, level.id])
                          }}
                          className="text-xs font-bold text-[#2563EB] hover:text-blue-700 transition-colors cursor-pointer flex items-center gap-1 select-none"
                        >
                          {level.hasMoreText}
                          <span>→</span>
                        </button>
                      </div>
                    )}
                    {expandedQuestionLevels.includes(level.id) && level.questions.length > 3 && (
                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            setExpandedQuestionLevels(prev => prev.filter(id => id !== level.id))
                          }}
                          className="text-xs font-bold text-[#2563EB] hover:text-blue-700 transition-colors cursor-pointer flex items-center gap-1 select-none"
                        >
                          View less
                          <span>↑</span>
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
