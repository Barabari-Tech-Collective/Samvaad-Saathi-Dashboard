"use client"

import * as React from "react"
import { IconCheck, IconChevronRight } from "@tabler/icons-react"
import { cn } from "@/lib/utils"

export interface RoleCreationStepperProps {
  currentStep: number // 0-indexed (0 to 4)
  onStepClick?: (stepIndex: number) => void
}

export const STEP_LABELS = [
  "Interview Type",
  "Role Details",
  "JD & Configuration",
  "Questions",
  "Review & Submit",
]

export function RoleCreationStepper({ currentStep, onStepClick }: RoleCreationStepperProps) {
  const [maxStep, setMaxStep] = React.useState(currentStep)

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("samvaad_saathi_max_step_reached")
      let reached = currentStep
      if (saved) {
        const parsed = parseInt(saved, 10)
        if (!isNaN(parsed)) reached = Math.max(reached, parsed)
      }
      if (localStorage.getItem("samvaad_saathi_draft_role")) {
        reached = Math.max(reached, 2)
      }
      setMaxStep(reached)
      
      // Update local storage to keep it up to date
      const currentSaved = localStorage.getItem("samvaad_saathi_max_step_reached")
      const currentSavedParsed = currentSaved ? parseInt(currentSaved, 10) : 0
      if (isNaN(currentSavedParsed) || reached > currentSavedParsed) {
        localStorage.setItem("samvaad_saathi_max_step_reached", reached.toString())
      }
    }
  }, [currentStep])

  return (
    <div className="flex items-center justify-start gap-1.5 md:gap-2.5 overflow-x-auto w-full pb-2 md:pb-0 scrollbar-none select-none">
      {STEP_LABELS.map((label, index) => {
        const isCompleted = index < currentStep
        const isActive = index === currentStep
        const isUpcoming = index > currentStep
        const isAllowed = index <= maxStep

        return (
          <React.Fragment key={label}>
            {/* Step Pill */}
            <div
              onClick={() => {
                if (isAllowed && onStepClick) {
                  onStepClick(index)
                }
              }}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-300 shrink-0",
                isCompleted && "bg-[#ECFDF5] border-[#10B981] text-[#065F46]",
                isActive && "bg-[#2563EB] border-[#2563EB] text-white shadow-sm shadow-blue-500/10",
                isUpcoming && "bg-white border-slate-200 text-slate-400",
                isAllowed ? "cursor-pointer hover:opacity-90 active:scale-95" : "cursor-not-allowed opacity-60"
              )}
            >
              {/* Left Circle Badge */}
              <div
                className={cn(
                  "flex items-center justify-center rounded-full size-[22px] text-[11px] font-black shrink-0 transition-colors duration-300",
                  isCompleted && "bg-[#10B981] text-white",
                  isActive && "bg-[#1E40AF] text-white",
                  isUpcoming && "bg-slate-100 text-slate-400"
                )}
              >
                {isCompleted ? (
                  <IconCheck className="size-3.5 stroke-[3.5]" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>

              {/* Step Title Label */}
              <span className={cn(
                "text-xs tracking-tight",
                isCompleted && "font-extrabold text-[#047857]",
                isActive && "font-black text-white",
                isUpcoming && "font-bold text-slate-400"
              )}>
                {label}
              </span>
            </div>

            {/* Separator Chevron */}
            {index < STEP_LABELS.length - 1 && (
              <IconChevronRight className="size-3.5 text-slate-300 shrink-0 mx-0.5" />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}
