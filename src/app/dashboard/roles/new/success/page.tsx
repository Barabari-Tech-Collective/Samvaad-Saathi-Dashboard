"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  IconCheck,
  IconChevronLeft,
  IconChevronRight,
  IconFileText,
  IconClock,
  IconCalendar,
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"

export default function RoleSubmittedSuccessPage() {
  const router = useRouter()

  return (
    <div className="flex flex-1 flex-col items-center justify-center min-h-[calc(100vh-140px)] p-4 sm:p-6 bg-slate-50/30 select-none animate-in fade-in duration-300">
      {/* Premium Centered Success Card */}
      <div className="relative w-full max-w-[480px] bg-white rounded-[24px] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        {/* Soft green top glow/background */}
        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-[#ECFDF5] via-[#ECFDF5]/20 to-transparent pointer-events-none" />

        {/* Card Content wrapper */}
        <div className="relative p-6 sm:p-8 flex flex-col items-center">
          
          {/* Success Icon */}
          <div className="mt-4 flex size-12 items-center justify-center rounded-full bg-[#E6F4EA] border border-[#A7F3D0]/50 shadow-sm animate-bounce-short">
            <IconCheck className="size-6 text-[#10B981] stroke-[3]" />
          </div>

          {/* Heading */}
          <h2 className="mt-5 text-xl sm:text-2xl font-black text-slate-800 tracking-tight text-center">
            Role submitted successfully
          </h2>

          {/* Description */}
          <p className="mt-2.5 text-xs sm:text-sm font-semibold text-slate-400 text-center leading-relaxed max-w-[340px]">
            Your role has been sent to the placement manager for review. You'll be notified once feedback is ready.
          </p>

          {/* Submission Details List */}
          <div className="mt-8 w-full border border-slate-100/80 rounded-2xl bg-white p-4.5 space-y-4 shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
            
            {/* Row 1: Role */}
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <div className="flex items-center gap-2.5 text-slate-400 font-bold uppercase tracking-wider text-[10px] sm:text-xs">
                <IconFileText className="size-4 text-slate-400" />
                <span>Role</span>
              </div>
              <span className="font-extrabold text-slate-800 text-right">
                Senior Backend Engineer
              </span>
            </div>

            {/* Row 2: Total Questions */}
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <div className="flex items-center gap-2.5 text-slate-400 font-bold uppercase tracking-wider text-[10px] sm:text-xs">
                <IconClock className="size-4 text-slate-400" />
                <span>Total questions</span>
              </div>
              <span className="font-extrabold text-slate-800 text-right">
                48 across 4 levels
              </span>
            </div>

            {/* Row 3: Submitted */}
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <div className="flex items-center gap-2.5 text-slate-400 font-bold uppercase tracking-wider text-[10px] sm:text-xs">
                <IconCalendar className="size-4 text-slate-400" />
                <span>Submitted</span>
              </div>
              <span className="font-extrabold text-slate-800 text-right">
                May 14, 2026
              </span>
            </div>

            {/* Row 4: Current Status */}
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <div className="flex items-center gap-2.5 text-slate-400 font-bold uppercase tracking-wider text-[10px] sm:text-xs">
                <span className="size-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
                <span>Current status</span>
              </div>
              <span className="font-extrabold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full text-[11px] border border-amber-100/50">
                Under Review
              </span>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex items-center justify-between w-full gap-4">
            
            {/* Back Button */}
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard/roles")}
              className="border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold rounded-xl px-4 py-2.5 shadow-sm text-xs sm:text-sm transition-all duration-200 h-11 flex items-center gap-1.5 cursor-pointer"
            >
              <IconChevronLeft className="size-4" />
              Back to roles
            </Button>

            {/* View Submission (Placeholder as requested) */}
            <Button
              type="button"
              onClick={() => router.push("/dashboard/roles")}
              className="bg-[#2563EB] hover:bg-blue-700 text-white font-bold rounded-xl px-4 sm:px-5 py-2.5 shadow-sm text-xs sm:text-sm transition-all duration-200 h-11 flex items-center gap-2 cursor-pointer"
            >
              View submission
              <IconChevronRight className="size-4" />
            </Button>

          </div>

        </div>
      </div>
    </div>
  )
}
