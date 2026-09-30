"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  IconPlus,
} from "@tabler/icons-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
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
import type { JobProfileItem } from "@/lib/api/hooks/analytics/types"



const STATUS_LABELS = {
  CHANGES_REQUIRED: "Changes Required",
  UNDER_REVIEW: "Under Review",
  DRAFT: "Draft",
  PUBLISHED: "Published",
  APPROVED: "Approved",
}

export default function RolesManagementPage() {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all")
  const [activeFilter, setActiveFilter] = React.useState<string>("All")
  
  const { jobProfilesSummary } = useJobProfilesSummary()
  
  const limit = 50 // fetch all to show cards
  const { jobProfiles, isLoadingJobProfiles } = useJobProfilesList(selectedCategory, limit)

  const kpis = jobProfilesSummary?.kpis ?? []
  
  const getStatusMeta = (statusRaw?: string) => {
    const s = (statusRaw || "Approved").toLowerCase()
    if (s.includes("changes") || s.includes("reject")) return { label: STATUS_LABELS.CHANGES_REQUIRED, bg: "bg-red-50 text-red-600" }
    if (s.includes("review") || s.includes("pending")) return { label: STATUS_LABELS.UNDER_REVIEW, bg: "bg-orange-50 text-orange-600" }
    if (s.includes("draft")) return { label: STATUS_LABELS.DRAFT, bg: "bg-slate-100 text-slate-600" }
    if (s.includes("publish")) return { label: STATUS_LABELS.PUBLISHED, bg: "bg-blue-50 text-blue-600" }
    return { label: STATUS_LABELS.APPROVED, bg: "bg-green-50 text-green-600" }
  }

  const draftCount = jobProfiles.filter((act) => getStatusMeta(act.status).label === STATUS_LABELS.DRAFT).length;
  const publishedCount = jobProfiles.filter((act) => getStatusMeta(act.status).label === STATUS_LABELS.PUBLISHED).length;

  const filteredProfiles = jobProfiles.filter((act) => {
    if (activeFilter === "All") return true;
    return getStatusMeta(act.status).label === activeFilter;
  });

  // Map KPI values to Figma filters
  const filters = [
    { label: "All", value: kpis.find((k: { label: string }) => k.label.toLowerCase().includes("total"))?.value ?? jobProfiles.length },
    { label: STATUS_LABELS.DRAFT, value: draftCount }, 
    { label: STATUS_LABELS.UNDER_REVIEW, value: kpis.find((k: { label: string }) => k.label.toLowerCase().includes("pending"))?.value ?? 0 },
    { label: "Changes Requested", value: kpis.find((k: { label: string }) => k.label.toLowerCase().includes("reject"))?.value ?? 0 },
    { label: STATUS_LABELS.APPROVED, value: kpis.find((k: { label: string }) => k.label.toLowerCase().includes("approved"))?.value ?? 0 },
    { label: STATUS_LABELS.PUBLISHED, value: publishedCount } 
  ]

  const getActionButtonMeta = (statusMetaLabel: string) => {
    switch (statusMetaLabel) {
      case STATUS_LABELS.CHANGES_REQUIRED:
        return { label: "View Requested Changes", variant: "outline" as const, className: "border-red-200 text-red-600 hover:bg-red-50" }
      case STATUS_LABELS.DRAFT:
        return { label: "Continue Editing", variant: "default" as const, className: "bg-[#1e293b] text-white hover:bg-[#0f172a]" }
      default:
        return { label: "View Interview", variant: "default" as const, className: "bg-[#1e293b] text-white hover:bg-[#0f172a]" }
    }
  }

  return (
    <div className="@container/main flex flex-col gap-6 py-5 px-4 md:gap-7 md:py-6 lg:px-8 bg-white min-h-[calc(100vh-80px)] select-none">
      
      {/* Page Header */}
      <div className="flex flex-col gap-1.5">
        <h1 className="text-xl font-bold tracking-tight text-[#6366f1]">Creator Portal</h1>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Interview Creation/Management System</h2>
        <p className="text-slate-500 text-sm mt-1">Design custom practice interviews across multiple domains for student training.</p>
      </div>

      {/* Filter Pills */}
      <div className="flex flex-wrap items-center gap-3 mt-4">
        {filters.map((f, i) => {
          const isActive = activeFilter === f.label
          return (
            <button
              key={i}
              onClick={() => setActiveFilter(f.label)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                isActive 
                  ? "bg-black border-black text-white" 
                  : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
              }`}
            >
              <span>{f.label}</span>
              <span className="font-bold">. {f.value}</span>
            </button>
          )
        })}
      </div>

      {/* Quick Actions & Filter Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mt-4">
        <Button
          onClick={() => {
            if (typeof window !== "undefined") {
              localStorage.removeItem("samvaad_saathi_draft_profile_id")
            }
            router.push("/dashboard/roles/new")
          }}
          className="bg-[#1e293b] hover:bg-[#0f172a] text-white font-semibold px-5 py-2.5 h-10 rounded-lg shadow-sm flex items-center gap-2 transition-all w-fit"
        >
          <IconPlus className="size-4" />
          New Interview
        </Button>

        <div className="w-full sm:w-[220px]">
          <Select
            value={selectedCategory}
            onValueChange={(val) => {
              setSelectedCategory(val)
              toast.info(`Filtered category to: ${val === "all" ? "All Categories" : val.toUpperCase()}`)
            }}
          >
            <SelectTrigger className="w-full bg-white border border-slate-200 text-slate-700 h-10 text-sm font-medium rounded-lg px-3 shadow-sm">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="it">IT</SelectItem>
              <SelectItem value="design">Design</SelectItem>
              <SelectItem value="sales">Sales</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="hr">HR</SelectItem>
              <SelectItem value="operations">Operations</SelectItem>
              <SelectItem value="data">Data</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mt-2 pb-10">
        {isLoadingJobProfiles ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-2xl" />
          ))
        ) : filteredProfiles.length === 0 ? (
          <p className="text-sm text-slate-500 py-4 col-span-full">No interviews found.</p>
        ) : filteredProfiles.map((act) => {
          const statusMeta = getStatusMeta(act.status)
          const btnMeta = getActionButtonMeta(statusMeta.label)
          
          // Use mocked breakdown or backend data if available
          const levelsInfo: { label: string; count: number; color: string }[] = act.levelsInfo || [
            { label: "Easy", count: act.easyQuestions ?? act.easy_questions ?? 0, color: "bg-[#FDE68A] text-slate-800" },
            { label: "Medium", count: act.mediumQuestions ?? act.medium_questions ?? 0, color: "bg-[#FBBF24] text-slate-800" },
            { label: "Hard", count: act.hardQuestions ?? act.hard_questions ?? 0, color: "bg-[#FFEDD5] text-slate-800" },
            { label: "Advanced", count: act.advancedQuestions ?? act.advanced_questions ?? 0, color: "bg-[#E0E7FF] text-slate-800" },
          ]
          
          const totalQ = act.totalQuestions ?? act.total_questions ?? levelsInfo.reduce((acc: number, cur: { count: number }) => acc + cur.count, 0)
          
          const getDateLabel = (statusLabel: string) => {
            if (statusLabel === STATUS_LABELS.DRAFT) return "Draft Saved";
            if (statusLabel === STATUS_LABELS.PUBLISHED) return "Published";
            if (statusLabel === STATUS_LABELS.UNDER_REVIEW) return "Submitted";
            if (statusLabel === STATUS_LABELS.CHANGES_REQUIRED) return "Submitted";
            return "Submitted";
          }

          const createdDate = new Date(act.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
          const displayDate = new Date(act.updatedAt || act.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
          const submittedDate = new Date(act.submittedAt || act.updatedAt || act.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

          return (
            <Card key={act.jobProfileId} className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full relative overflow-hidden">
              <div className="flex justify-between items-start mb-6 gap-4">
                <div>
                  <h3 className="font-bold text-[22px] text-slate-900 leading-tight">{act.jobName || 'Untitled Role'}</h3>
                  <p className="text-sm text-slate-500 font-medium">{act.category || act.companyName || 'General Role'}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${statusMeta.bg}`}>
                  {statusMeta.label}
                </div>
              </div>

              <div className="flex gap-6 mb-5">
                {/* Dates Column */}
                <div className="flex flex-col gap-3 min-w-[100px] text-xs">
                  <div>
                    <div className="text-slate-400 font-medium">Created</div>
                    <div className="text-slate-700 font-bold">{createdDate}</div>
                  </div>
                  <div>
                    <div className="text-slate-400 font-medium">{getDateLabel(statusMeta.label)}</div>
                    <div className="text-slate-700 font-bold">{submittedDate}</div>
                  </div>
                  {statusMeta.label === STATUS_LABELS.CHANGES_REQUIRED && (
                     <div className="text-red-500">
                       <div className="font-medium">Changes</div>
                       <div className="font-bold">{displayDate}</div>
                     </div>
                  )}
                  {statusMeta.label === STATUS_LABELS.APPROVED && (
                     <div className="text-green-500">
                       <div className="font-medium">Approved</div>
                       <div className="font-bold">{displayDate}</div>
                     </div>
                  )}
                  {statusMeta.label === STATUS_LABELS.UNDER_REVIEW && (
                     <div className="text-orange-500 font-bold mt-1 text-sm">
                       Under Review
                     </div>
                  )}
                  {statusMeta.label === STATUS_LABELS.PUBLISHED && (
                     <div className="text-blue-500">
                       <div className="font-medium">Published</div>
                       <div className="font-bold">{displayDate}</div>
                     </div>
                  )}
                </div>

                {/* Levels Grid */}
                <div className="flex-1">
                  {statusMeta.label === "Draft" && totalQ === 0 ? (
                     <div className="h-full flex items-center justify-center bg-slate-50 rounded-xl">
                       <span className="text-sm font-semibold text-slate-400">No Questions Generated</span>
                     </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3 h-full">
                      {levelsInfo.map((l: { label: string; count: number; color: string }, idx: number) => (
                        <div key={idx} className={`p-3 rounded-lg flex flex-col justify-center ${l.color}`}>
                          <span className="text-[13px] font-medium opacity-80 leading-tight">{l.label}</span>
                          <span className="text-sm font-semibold">{l.count}Q</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <span className="text-[22px] font-black text-[#1e293b]">{totalQ}Qs</span>
              </div>

              <div className="mt-auto">
                {/* Admin Comment */}
                {statusMeta.label !== STATUS_LABELS.DRAFT ? (
                  <div className="mb-4 text-[13px] text-slate-700 bg-slate-100 p-3 rounded-lg">
                    <span className="font-bold text-slate-900 mr-2">Admin</span>
                    <span className={!act.adminComment && statusMeta.label === STATUS_LABELS.UNDER_REVIEW ? "text-slate-500 italic" : ""}>
                      {statusMeta.label === STATUS_LABELS.UNDER_REVIEW 
                        ? (act.adminComment || "Not Yet Reviewed")
                        : (act.adminComment || "No additional comments provided.")}
                    </span>
                  </div>
                ) : null}

                {/* Action Button */}
                <Button 
                  onClick={() => navigateToJobProfileStep(act, router)}
                  variant={btnMeta.variant} 
                  className={`w-full font-bold h-11 rounded-lg ${btnMeta.className}`}
                >
                  {btnMeta.label}
                </Button>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

