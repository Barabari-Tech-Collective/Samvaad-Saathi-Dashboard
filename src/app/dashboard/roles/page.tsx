"use client"

import * as React from "react"
import { Link } from "next-view-transitions"
import { useRouter } from "next/navigation"
import {
  IconPlus,
  IconClock,
  IconCheck,
  IconX,
  IconChevronDown,
  IconBriefcase,
  IconEye,
  IconAlertCircle,
  IconFileText,
  IconArrowUpRight,
} from "@tabler/icons-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function RolesManagementPage() {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all")
  const [activeCardIdx, setActiveCardIdx] = React.useState<number | null>(null)

  // Mock summary card counts
  const summaryCards = [
    {
      title: "Total Roles",
      count: "20",
      icon: <IconBriefcase className="size-4" />,
      colorClass: "text-blue-600",
    },
    {
      title: "Pending Review",
      count: "02",
      icon: <IconClock className="size-4" />,
      colorClass: "text-amber-600",
    },
    {
      title: "Approved",
      count: "16",
      icon: <IconCheck className="size-4" />,
      colorClass: "text-emerald-600",
    },
    {
      title: "Rejected",
      count: "02",
      icon: <IconX className="size-4" />,
      colorClass: "text-rose-600",
    },
  ]

  // Mock activity records
  const recentActivities = [
    {
      id: 1,
      role: "Frontend Developer",
      status: "approved",
      time: "2 Hours ago",
      icon: <IconCheck className="size-4 text-emerald-600" />,
      bg: "bg-emerald-50",
    },
    {
      id: 2,
      role: "UX Designer",
      status: "approved",
      time: "5 Hours ago",
      icon: <IconCheck className="size-4 text-emerald-600" />,
      bg: "bg-emerald-50",
    },
    {
      id: 3,
      role: "Data Analytics",
      status: "pending",
      time: "1 Day ago",
      icon: <IconClock className="size-4 text-amber-600" />,
      bg: "bg-amber-50",
    },
    {
      id: 4,
      role: "Backend Developer",
      status: "requires revision",
      time: "5 Hours ago",
      icon: <IconAlertCircle className="size-4 text-rose-600" />,
      bg: "bg-rose-50",
    },
    {
      id: 5,
      role: "Product Manager",
      status: "draft saved",
      time: "5 Hours ago",
      icon: <IconFileText className="size-4 text-slate-500" />,
      bg: "bg-slate-50",
    },
  ]

  return (
    <div className="@container/main flex flex-col gap-6 py-5 px-4 md:gap-7 md:py-6 lg:px-8 bg-slate-50/50 min-h-[calc(100vh-80px)] select-none">
      {/* Page Header */}
      <div className="flex flex-col gap-1.5">
        <h1 className="text-xl font-black tracking-tight text-slate-800">Roles</h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card, idx) => {
          const isActive = activeCardIdx === idx
          return (
            <Card
              key={idx}
              onClick={() => {
                setActiveCardIdx(idx)
                toast.info(`Active filter set to: ${card.title}`)
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
                    {card.title}
                  </p>
                  <h3 className={`text-3xl font-black transition-colors duration-200 ${isActive ? "text-[#1E40AF]" : "text-slate-800 group-hover:text-[#1E40AF]"
                    }`}>
                    {card.count}
                  </h3>
                </div>

                <div className={`p-2.5 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-200 ${isActive ? "bg-white text-[#1E40AF]" : "bg-slate-50 group-hover:bg-white text-slate-600 group-hover:text-[#1E40AF]"
                  }`}>
                  {React.cloneElement(card.icon, {
                    className: `size-4 transition-colors duration-200 ${isActive ? "text-blue-600" : card.colorClass + " group-hover:text-blue-600"}`
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
            onClick={() => router.push("/dashboard/roles/new")}
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
              toast.info(`Filtered category to: ${val === "all" ? "All Categories" : val}`)
            }}
          >
            <SelectTrigger className="w-full sm:w-[220px] bg-white border border-slate-200 text-slate-700 h-10 text-xs font-medium rounded-lg px-3 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 shadow-sm">
              <SelectValue placeholder="Create New Role" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-slate-100 rounded-lg shadow-md text-xs font-semibold text-slate-700">
              <SelectItem value="all" className="hover:bg-slate-50 cursor-pointer">Create New Role</SelectItem>
              <SelectItem value="engineering" className="hover:bg-slate-50 cursor-pointer">Engineering</SelectItem>
              <SelectItem value="design" className="hover:bg-slate-50 cursor-pointer">Design</SelectItem>
              <SelectItem value="product" className="hover:bg-slate-50 cursor-pointer">Product Management</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Recent Activity Card */}
      <Card className="border border-slate-200/80 rounded-2xl bg-white shadow-sm overflow-hidden flex-1">
        <CardContent className="p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-800 tracking-tight">
              Recent Activity
            </h3>
            <button
              onClick={() => {
                toast.info("Viewing all recent activities...")
              }}
              className="text-xs font-bold text-[#2563EB] hover:text-blue-700 transition-colors flex items-center gap-1 cursor-pointer select-none"
            >
              View All
              <IconArrowUpRight className="size-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {recentActivities.map((act) => (
              <div
                key={act.id}
                className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4 group transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl flex items-center justify-center shrink-0 ${act.bg}`}>
                    {act.icon}
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-slate-700 leading-none">
                      Role '<span className="text-slate-800 font-extrabold">{act.role}</span>' {act.status}
                    </p>
                  </div>
                </div>

                <span className="text-[11px] font-semibold text-slate-400 shrink-0">
                  {act.time}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
