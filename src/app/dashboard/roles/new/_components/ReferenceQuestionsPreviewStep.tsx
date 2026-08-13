import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  IconAlertCircle,
  IconBriefcase,
  IconChevronDown,
  IconChevronUp,
  IconFileText,
} from "@tabler/icons-react"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { UseFormReturn } from "react-hook-form"
import { AddRoleFormValues, DifficultyLevel } from "./constants"

interface ReferenceQuestionsPreviewStepProps {
  form: UseFormReturn<AddRoleFormValues>
  difficultyLevels: DifficultyLevel[]
  knowledgeQuestions: any
}

export function ReferenceQuestionsPreviewStep({
  form,
  difficultyLevels,
  knowledgeQuestions
}: ReferenceQuestionsPreviewStepProps) {
  const router = useRouter()
  const [selectedLevel, setSelectedLevel] = useState<number>(1)
  
  const activeQuestionsData = knowledgeQuestions?.topics || []
  
  // Dynamically compute available levels and question counts from the parsed PDF data
  const availableLevelsMap = new Map<number, number>()
  activeQuestionsData.forEach((topic: any) => {
    topic.levels?.forEach((l: any) => {
      if (l.questions && l.questions.length > 0) {
        const currentCount = availableLevelsMap.get(l.level) || 0
        availableLevelsMap.set(l.level, currentCount + l.questions.length)
      }
    })
  })

  const availableLevels = Array.from(availableLevelsMap.entries()).map(([level, count]) => ({
    level: Number(level),
    count,
    badge: `L${level}`,
    name: `Level ${level}`
  })).sort((a, b) => a.level - b.level)

  const originalFileName = knowledgeQuestions?.originalFileName || "Uploaded Document"
  const uploadedAt = knowledgeQuestions?.uploadedAt ? new Date(knowledgeQuestions.uploadedAt).toLocaleString() : "Just now"
  const topicsDetected = knowledgeQuestions?.topicsDetected || []
  const totalQuestionsData = knowledgeQuestions?.totalQuestions || 0
  
  const formValues = form.getValues()
  const jobName = formValues.jobName || "Unnamed Role"
  const category = formValues.category || "Uncategorized"
  const experienceLevel = formValues.experienceLevel || "Fresher"
  
  const selectedDifficultyLevels = difficultyLevels.filter(l => l.selected)

  // Set initial selected level to the first available level if current is not valid
  useEffect(() => {
    if (availableLevels.length > 0) {
      const isCurrentLevelValid = availableLevels.some(l => l.level === selectedLevel)
      if (!isCurrentLevelValid) {
        setSelectedLevel(availableLevels[0].level)
      }
    }
  }, [availableLevels, selectedLevel])

  // Filter topics that have questions for the selectedLevel
  const filteredTopics = activeQuestionsData.filter((topic: any) => {
    const levelData = topic.levels?.find((l: any) => l.level === selectedLevel)
    return levelData && levelData.questions && levelData.questions.length > 0
  })

  const [expandedTopic, setExpandedTopic] = useState<string | null>(null)
  const [viewAllTopics, setViewAllTopics] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (filteredTopics.length > 0) {
      setExpandedTopic(filteredTopics[0].topicName.toLowerCase())
    } else {
      setExpandedTopic(null)
    }
  }, [selectedLevel])

  return (
    <div className="space-y-6 select-none animate-in fade-in duration-200">
      {/* Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Card: Role Summary */}
        <Card className="border border-slate-200/80 rounded-3xl p-6 bg-white space-y-5 shadow-sm">
          <div className="flex items-center gap-2 text-slate-800 font-extrabold text-sm border-b border-slate-100 pb-3">
            <IconBriefcase className="size-4.5 text-slate-400" />
            <span>ROLE SUMMARY</span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-600">
            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">ROLE NAME</div>
              <div className="text-sm font-extrabold text-slate-800 mt-1">{jobName}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">CATEGORY</div>
              <div className="text-sm font-extrabold text-slate-800 mt-1">{category}</div>
            </div>
            <div className="mt-2">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">EXPERIENCE</div>
              <div className="text-sm font-extrabold text-slate-800 mt-1">{experienceLevel}</div>
            </div>
            <div className="mt-2">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">LEVELS FROM PDF</div>
              <div className="text-sm font-extrabold text-slate-800 mt-1">{availableLevels.length} levels</div>
            </div>
          </div>
          
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">LEVELS FOUND IN DOCUMENT</div>
            <div className="grid grid-cols-2 gap-3">
              {availableLevels.map((lvl) => {
                const isSelected = selectedLevel === lvl.level
                return (
                  <div
                    key={lvl.badge}
                    onClick={() => setSelectedLevel(lvl.level)}
                    className={cn(
                      "flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer select-none",
                      isSelected
                        ? "bg-blue-50/50 border-blue-500 ring-1 ring-blue-500/20"
                        : "bg-[#F8FAFC] border-slate-100 hover:border-slate-200"
                    )}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className={cn(
                        "text-[10px] font-black px-1.5 py-0.5 rounded transition-colors",
                        isSelected ? "text-white bg-[#2563EB]" : "text-blue-600 bg-blue-50"
                      )}>
                        {lvl.badge}
                      </span>
                      <span className="text-xs font-bold text-slate-700">{lvl.name}</span>
                    </div>
                    <span className="text-[11px] font-bold text-slate-500">{lvl.count} Questions</span>
                  </div>
                )
              })}
              {availableLevels.length === 0 && (
                <div className="col-span-2 text-xs text-slate-400 italic py-2">
                  No levels detected in the document.
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Right Card: Knowledge Set Source */}
        <Card className="border border-slate-200/80 rounded-3xl p-6 bg-white space-y-5 shadow-sm">
          <div className="flex items-center gap-2 text-slate-800 font-extrabold text-sm border-b border-slate-100 pb-3">
            <IconFileText className="size-4.5 text-slate-400" />
            <span>KNOWLEDGE SET SOURCE</span>
          </div>
          
          <div className="flex items-center gap-3 p-4 bg-[#F8FAFC]/60 border border-slate-200/60 rounded-2xl">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <IconFileText className="size-5.5 text-blue-600" />
            </div>
            <div className="max-w-[200px]">
              <h4 className="text-xs font-extrabold text-slate-800 truncate" title={originalFileName}>{originalFileName}</h4>
              <p className="text-[10px] font-semibold text-slate-400 mt-0.5">{uploadedAt}</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">TOPICS DETECTED</div>
            <div className="flex flex-wrap gap-1.5">
              {topicsDetected.length > 0 ? topicsDetected.map((t: string) => (
                <Badge key={t} variant="outline" className="bg-[#EFF6FF] text-[#2563EB] border-none text-[11px] font-semibold px-3 py-1 rounded-full">
                  {t}
                </Badge>
              )) : (
                <span className="text-xs text-slate-400 italic">No topics detected</span>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-600">
            <span>Question count</span>
            <span className="text-[#2563EB] font-black"># {totalQuestionsData} Reference Questions</span>
          </div>
        </Card>
      </div>

      {/* Main Section Card */}
      <Card className="border border-slate-200 rounded-3xl p-6 bg-white shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-800">Reference questions by topic</h3>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Preview the question bank grouped by topic detected in the uploaded document.
            </p>
          </div>
          <Badge className="bg-[#EFF6FF] hover:bg-[#EFF6FF] text-[#2563EB] border-none text-[11px] font-bold px-3 py-1 rounded-full shrink-0">
            {filteredTopics.length} topic{filteredTopics.length !== 1 ? "s" : ""}
          </Badge>
        </div>

        <div className="space-y-3">
          {filteredTopics.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-2xl select-none">
              <IconAlertCircle className="size-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs text-slate-400 font-semibold">
                No reference questions available for Level {selectedLevel}. Try selecting another level or uploading a document.
              </p>
            </div>
          ) : (
            filteredTopics.map((topic: any, idx: number) => {
              const levelData = topic.levels?.find((l: any) => l.level === selectedLevel)
              const questionsList = levelData?.questions || []
              const totalQuestions = questionsList.length
              const previewCount = Math.min(5, totalQuestions)
              
              const topicId = topic.topicName.toLowerCase()
              const isExpanded = expandedTopic === topicId
              const isViewAll = !!viewAllTopics[topicId]
              const previewQuestions = isViewAll ? questionsList : questionsList.slice(0, 5)

              return (
                <div
                  key={`${topic.topicName}-${idx}`}
                  className={cn(
                    "border rounded-2xl bg-white overflow-hidden transition-all duration-200",
                    isExpanded ? "border-[#2563EB]/40 ring-1 ring-blue-500/5 shadow-sm" : "border-slate-200 hover:border-blue-200"
                  )}
                >
                  {/* Accordion Row Header */}
                  <div
                    onClick={() => setExpandedTopic(isExpanded ? null : topicId)}
                    className="flex items-center justify-between p-4 cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 font-bold text-xs uppercase">
                        {topic.topicName.charAt(0)}
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="text-sm font-extrabold text-slate-800">{topic.topicName}</h4>
                        <p className="text-[10px] font-semibold text-slate-400">
                          {isExpanded && isViewAll 
                            ? `Showing all ${totalQuestions} questions` 
                            : `Preview of ${previewCount} of ${totalQuestions} questions`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                        {totalQuestions} Questions
                      </span>
                      {isExpanded ? (
                        <IconChevronUp className="size-4 text-slate-400" />
                      ) : (
                        <IconChevronDown className="size-4 text-slate-400" />
                      )}
                    </div>
                  </div>

                  {/* Expanded Content Area */}
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-1 border-t border-slate-50 space-y-3 animate-in fade-in duration-200">
                      <div className="space-y-2">
                        {previewQuestions.map((qText: string, qIdx: number) => (
                          <div
                            key={qIdx}
                            className="p-3 bg-slate-50/50 hover:bg-slate-50 rounded-xl text-xs font-semibold text-slate-700 transition-colors border border-slate-100 flex items-center gap-3"
                          >
                            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold">
                              {qIdx + 1}
                            </span>
                            <span>{qText}</span>
                          </div>
                        ))}
                      </div>

                      {totalQuestions > 5 && (
                        <div className="pt-2">
                          <button
                            type="button"
                            onClick={() => {
                              setViewAllTopics(prev => ({ ...prev, [topicId]: !isViewAll }))
                            }}
                            className="text-xs font-bold text-[#2563EB] hover:text-blue-700 transition-colors cursor-pointer flex items-center gap-1"
                          >
                            {isViewAll ? "View less ↑" : `View all ${totalQuestions} questions →`}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>
      </Card>

      {/* Bottom Info Section */}
      <Card className="border border-amber-100 bg-amber-50/60 rounded-3xl p-6 flex flex-col justify-center space-y-3 shadow-sm select-none">
        <div className="flex items-center gap-2 text-amber-800">
          <IconAlertCircle className="size-5 shrink-0 text-amber-600" />
          <h4 className="font-extrabold text-sm">Reference only</h4>
        </div>
        <p className="text-xs font-bold text-amber-700 leading-relaxed">
          Reference questions will not appear directly in interviews. They are only used as guidance for AI question generation.
        </p>
      </Card>

      {/* Skip/Back Links */}
      <div className="flex items-center px-1 pt-2 select-none">
        <button
          type="button"
          onClick={() => router.push("/dashboard/roles/new?step=2")}
          className="text-xs font-bold text-[#2563EB] hover:text-blue-700 transition-colors flex items-center gap-1"
        >
          <span>&lt; Back to JD & Configuration</span>
        </button>
      </div>
    </div>
  )
}
