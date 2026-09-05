"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  IconPlus,
  IconClock,
  IconCheck,
  IconX,
  IconBriefcase,
  IconAlertCircle,
  IconFileText,
  IconArrowUpRight,
} from "@tabler/icons-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { useJobProfilesSummary, useJobProfilesList } from "@/lib/api/hooks/analytics/useJobProfiles"
import { navigateToJobProfileStep } from "./utils"

export default function RolesManagementPage() {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all")
  const [activeCardIdx, setActiveCardIdx] = React.useState<number | null>(null)
  const [showAllRecent, setShowAllRecent] = React.useState<boolean>(false)

  const { jobProfilesSummary, isLoadingJobProfilesSummary } = useJobProfilesSummary()
  
  // Fetch up to 5 items initially. When showAllRecent is true, fetch up to 50 to prevent UI freezing.
  const limit = showAllRecent ? 50 : 5
  const { jobProfiles, isLoadingJobProfiles } = useJobProfilesList(selectedCategory, limit)

  const kpis = jobProfilesSummary?.kpis ?? []

  const getSummaryCardMeta = (title: string) => {
    const t = title.toLowerCase()
    if (t.includes("pending")) return { icon: <IconClock className="size-4" />, colorClass: "text-amber-600" }
    if (t.includes("approved")) return { icon: <IconCheck className="size-4" />, colorClass: "text-emerald-600" }
    if (t.includes("reject")) return { icon: <IconX className="size-4" />, colorClass: "text-rose-600" }
    return { icon: <IconBriefcase className="size-4" />, colorClass: "text-blue-600" }
  }

  const getActivityMeta = (status: string) => {
    const s = status.toLowerCase()
    if (s.includes("approved")) return { icon: <IconCheck className="size-4 text-emerald-600" />, bg: "bg-emerald-50" }
    if (s.includes("pending")) return { icon: <IconClock className="size-4 text-amber-600" />, bg: "bg-amber-50" }
    if (s.includes("revision") || s.includes("reject")) return { icon: <IconAlertCircle className="size-4 text-rose-600" />, bg: "bg-rose-50" }
    return { icon: <IconFileText className="size-4 text-slate-500" />, bg: "bg-slate-50" }
  }

  return (
    <div className="@container/main flex flex-col gap-6 py-5 px-4 md:gap-7 md:py-6 lg:px-8 bg-slate-50/50 min-h-[calc(100vh-80px)] select-none">
      {/* Page Header */}
      <div className="flex flex-col gap-1.5">
        <h1 className="text-xl font-black tracking-tight text-slate-800">Roles</h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoadingJobProfilesSummary ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full rounded-2xl" />
          ))
        ) : (kpis.length > 0 ? kpis : [
          { label: "Total Roles", value: 0 },
          { label: "Pending Review", value: 0 },
          { label: "Approved", value: 0 },
          { label: "Rejected", value: 0 }
        ]).map((kpi, idx) => {
          const isActive = activeCardIdx === idx
          const meta = getSummaryCardMeta(kpi.label)
          return (
            <Card
              key={idx}
              onClick={() => {
                setActiveCardIdx(idx)
                toast.info(`Active filter set to: ${kpi.label}`)
              }}
              className={`border rounded-2xl shadow-sm overflow-hidden transition-all duration-200 hover:-translate-y-0.5 group cursor-pointer ${isActive
                ? "bg-[#EFF6FF] border-[#BFDBFE]/85 shadow-md"
                : "bg-white border-slate-200/80 hover:bg-[#EFF6FF]/40 hover:border-[#BFDBFE]/40 hover:shadow-md"
                }`}
            >
              <CardContent className="p-5 flex items-center justify-between">
                <div className="space-y-1">
                  <p className={`text-xs font-bold tracking-wider uppercase transition-colors duration-200 ${isActive ? "text-[#1E40AF]/80" : "text-slate-400 group-hover:text-[#1E40AF]/60"
                    }`}>
                    {kpi.label}
                  </p>
                  <h3 className={`text-3xl font-black transition-colors duration-200 ${isActive ? "text-[#1E40AF]" : "text-slate-800 group-hover:text-[#1E40AF]"
                    }`}>
                    {kpi.value ?? "0"}
                  </h3>
                </div>

                <div className={`p-2.5 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-200 ${isActive ? "bg-white text-[#1E40AF]" : "bg-slate-50 group-hover:bg-white text-slate-600 group-hover:text-[#1E40AF]"
                  }`}>
                  {React.cloneElement(meta.icon, {
                    className: `size-4 transition-colors duration-200 ${isActive ? "text-blue-600" : meta.colorClass + " group-hover:text-blue-600"}`
                  })}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Quick Actions & Filter Section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 px-1 py-1">
        <div className="space-y-2.5">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Quick Actions
          </h4>
          <Button
            onClick={() => {
              if (typeof window !== "undefined") {
                localStorage.removeItem("samvaad_saathi_draft_profile_id")
              }
              router.push("/dashboard/roles/new")
            }}
            className="bg-[#0F172A] hover:bg-slate-800 text-white font-semibold text-xs px-5 py-2.5 h-10 rounded-lg shadow-sm flex items-center gap-1.5 transition-all select-none"
          >
            <IconPlus className="size-4" />
            Create New Role
          </Button>
        </div>

        <div className="space-y-2.5 min-w-[200px] sm:text-right">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider sm:text-right">
            Filter By Category
          </h4>
          <Select
            value={selectedCategory}
            onValueChange={(val) => {
              setSelectedCategory(val)
              toast.info(`Filtered category to: ${val === "all" ? "All Categories" : val.toUpperCase()}`)
            }}
          >
            <SelectTrigger className="w-full sm:w-[220px] bg-white border border-slate-200 text-slate-700 h-10 text-xs font-medium rounded-lg px-3 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 shadow-sm">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-slate-100 rounded-lg shadow-md text-xs font-semibold text-slate-700">
              <SelectItem value="all" className="hover:bg-slate-50 cursor-pointer">All Categories</SelectItem>
              <SelectItem value="it" className="hover:bg-slate-50 cursor-pointer">IT</SelectItem>
              <SelectItem value="design" className="hover:bg-slate-50 cursor-pointer">Design</SelectItem>
              <SelectItem value="sales" className="hover:bg-slate-50 cursor-pointer">Sales</SelectItem>
              <SelectItem value="marketing" className="hover:bg-slate-50 cursor-pointer">Marketing</SelectItem>
              <SelectItem value="hr" className="hover:bg-slate-50 cursor-pointer">HR</SelectItem>
              <SelectItem value="operations" className="hover:bg-slate-50 cursor-pointer">Operations</SelectItem>
              <SelectItem value="data" className="hover:bg-slate-50 cursor-pointer">Data</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Recent Activity Card */}
      <Card className="border border-slate-200/80 rounded-2xl bg-white shadow-sm overflow-hidden flex-1">
        <CardContent className="p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-800 tracking-tight">
              Recent Roles Activity
            </h3>
            <button
              onClick={() => {
                setShowAllRecent((prev) => !prev)
              }}
              className="text-xs font-bold text-[#2563EB] hover:text-blue-700 transition-colors flex items-center gap-1 cursor-pointer select-none"
            >
              {showAllRecent ? "View Less" : "View All"}
              <IconArrowUpRight className={`size-3.5 transition-transform ${showAllRecent ? "rotate-180" : ""}`} />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {isLoadingJobProfiles ? (
              <div className="space-y-4 pt-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-xl" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                ))}
              </div>
            ) : jobProfiles.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4">No recent activity.</p>
            ) : jobProfiles.map((act) => {
              const meta = getActivityMeta("approved") // Default styling for job profiles
              return (
              <div
                onClick={() => navigateToJobProfileStep(act, router)}
                key={act.jobProfileId}
                className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4 group transition-all hover:bg-slate-50/50 -mx-4 px-4 rounded-xl cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl flex items-center justify-center shrink-0 ${meta.bg}`}>
                    {meta.icon}
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-slate-700 leading-none group-hover:text-blue-600 transition-colors">
                      Role &apos;<span className="text-slate-800 font-extrabold group-hover:text-blue-700">{act.jobName}</span>&apos; created
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-semibold text-slate-400 shrink-0">
                    {new Date(act.createdAt).toLocaleDateString()}
                  </span>
                  <IconArrowUpRight className="size-4 text-slate-300 opacity-0 group-hover:opacity-100 group-hover:text-blue-500 transition-all -translate-x-2 group-hover:translate-x-0" />
                </div>
              </div>
            )})}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
