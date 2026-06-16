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

const defaultTopics = [
  {
    topicName: "JavaScript",
    levels: [
      {
        level: 1,
        questions: [
          "What is a variable in JavaScript?",
          "Difference between var, let, and const?",
          "What are primitive data types?",
          "What is the use of console.log()?"
        ]
      },
      {
        level: 2,
        questions: [
          "What is hoisting in JavaScript?",
          "Explain scope and block scope.",
          "What is the difference between == and ===?",
          "What are template literals?"
        ]
      },
      {
        level: 3,
        questions: [
          "What are closures in JavaScript?",
          "Explain callback functions with an example.",
          "What is event bubbling?",
          "Explain synchronous vs asynchronous JavaScript."
        ]
      },
      {
        level: 4,
        questions: [
          "How does the JavaScript event loop work?",
          "Explain promises and async/await.",
          "How would you optimize JavaScript performance?",
          "Explain memory leaks in JavaScript."
        ]
      }
    ]
  },
  {
    topicName: "React",
    levels: [
      {
        level: 1,
        questions: [
          "What is React?",
          "What are components in React?",
          "What are props?",
          "What is JSX?"
        ]
      },
      {
        level: 2,
        questions: [
          "Difference between props and state?",
          "What is useState?",
          "What is useEffect?",
          "What is conditional rendering?"
        ]
      },
      {
        level: 3,
        questions: [
          "Explain controlled and uncontrolled components.",
          "What is prop drilling?",
          "How does React Router work?",
          "What are React hooks?"
        ]
      },
      {
        level: 4,
        questions: [
          "How would you optimize a React application?",
          "Explain useMemo and useCallback.",
          "How do you handle API errors in React?",
          "Explain React reconciliation."
        ]
      }
    ]
  }
]

interface ReferenceQuestionsPreviewStepProps {
  knowledgeQuestions: any
}

export function ReferenceQuestionsPreviewStep({
  knowledgeQuestions
}: ReferenceQuestionsPreviewStepProps) {
  const router = useRouter()
  const [selectedLevel, setSelectedLevel] = useState<number>(1)
  
  const activeQuestionsData = knowledgeQuestions?.topics || defaultTopics

  // Filter topics that have questions for the selectedLevel
  const filteredTopics = activeQuestionsData.filter((topic: any) => {
    const levelData = topic.levels?.find((l: any) => l.level === selectedLevel)
    return levelData && levelData.questions && levelData.questions.length > 0
  })

  const [expandedTopic, setExpandedTopic] = useState<string | null>(null)

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
              <div className="text-sm font-extrabold text-slate-800 mt-1">Senior Front-End Developer</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">CATEGORY</div>
              <div className="text-sm font-extrabold text-slate-800 mt-1">Engineering</div>
            </div>
            <div className="mt-2">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">EXPERIENCE</div>
              <div className="text-sm font-extrabold text-slate-800 mt-1">4–6 Years</div>
            </div>
            <div className="mt-2">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">LEVELS SELECTED</div>
              <div className="text-sm font-extrabold text-slate-800 mt-1">4 levels</div>
            </div>
          </div>
          
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">LEVELS CONFIGURED</div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: "L1", name: "Level 1", count: 15, lvlVal: 1 },
                { id: "L2", name: "Level 2", count: 15, lvlVal: 2 },
                { id: "L3", name: "Level 3", count: 10, lvlVal: 3 },
                { id: "L4", name: "Level 4", count: 10, lvlVal: 4 },
              ].map((lvl) => {
                const isSelected = selectedLevel === lvl.lvlVal
                return (
                  <div
                    key={lvl.id}
                    onClick={() => setSelectedLevel(lvl.lvlVal)}
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
                        {lvl.id}
                      </span>
                      <span className="text-xs font-bold text-slate-700">{lvl.name}</span>
                    </div>
                    <span className="text-[11px] font-bold text-slate-500">{lvl.count} Questions</span>
                  </div>
                )
              })}
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
            <div>
              <h4 className="text-xs font-extrabold text-slate-800">Frontend_Question_Bank.pdf</h4>
              <p className="text-[10px] font-semibold text-slate-400 mt-0.5">Uploaded today, 2:45 PM</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">TOPICS DETECTED</div>
            <div className="flex flex-wrap gap-1.5">
              {["JavaScript", "React", "TypeScript", "Performance Optimization", "System Design"].map((t) => (
                <Badge key={t} variant="outline" className="bg-[#EFF6FF] text-[#2563EB] border-none text-[11px] font-semibold px-3 py-1 rounded-full">
                  {t}
                </Badge>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-600">
            <span>Question count</span>
            <span className="text-[#2563EB] font-black"># 42 Reference Questions</span>
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
                No questions available for Level {selectedLevel}
              </p>
            </div>
          ) : (
            filteredTopics.map((topic: any) => {
              const levelData = topic.levels?.find((l: any) => l.level === selectedLevel)
              const questionsList = levelData?.questions || []
              const totalQuestions = questionsList.length
              const previewCount = Math.min(5, totalQuestions)
              const previewQuestions = questionsList.slice(0, 5)
              
              const topicId = topic.topicName.toLowerCase()
              const isExpanded = expandedTopic === topicId

              return (
                <div
                  key={topic.topicName}
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
                        <p className="text-[11px] font-semibold text-slate-400">
                          Preview of {previewCount} of {totalQuestions} questions
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="bg-[#EFF6FF] text-[#2563EB] border-none text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {totalQuestions} Question{totalQuestions !== 1 ? "s" : ""}
                      </Badge>
                      {isExpanded ? (
                        <IconChevronUp className="size-4 text-slate-400" />
                      ) : (
                        <IconChevronDown className="size-4 text-slate-400" />
                      )}
                    </div>
                  </div>

                  {/* Questions list when expanded */}
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

                      {totalQuestions > 0 && (
                        <div className="pt-2">
                          <button
                            type="button"
                            onClick={() => {
                              toast.info(
                                `Questions for ${topic.topicName} (Level ${selectedLevel}):\n\n` +
                                  questionsList.map((q: string, i: number) => `${i + 1}. ${q}`).join("\n")
                              )
                            }}
                            className="text-xs font-bold text-[#2563EB] hover:text-blue-700 transition-colors cursor-pointer flex items-center gap-1"
                          >
                            View all {totalQuestions} question{totalQuestions !== 1 ? "s" : ""} →
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
      <div className="flex items-center justify-between px-1 pt-2 select-none">
        <button
          type="button"
          onClick={() => router.push("/dashboard/roles/new?step=2")}
          className="text-xs font-bold text-[#2563EB] hover:text-blue-700 transition-colors flex items-center gap-1"
        >
          <span>&lt; Back to JD & Configuration</span>
        </button>
        <button
          type="button"
          onClick={() => router.push("/dashboard/roles/new/questions")}
          className="text-xs font-bold text-[#2563EB] hover:text-blue-700 transition-colors flex items-center gap-1"
        >
          <span>Skip to generation &gt;</span>
        </button>
      </div>
    </div>
  )
}
