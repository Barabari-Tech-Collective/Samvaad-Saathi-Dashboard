import { cn } from "@/lib/utils"

interface Level {
  level: number
  selected: boolean
  badgeLabel: string
  title: string
}

interface QuestionLevelTabsProps {
  activeLevels: Level[]
  questions: any[]
  activeTab: number
  setActiveTab: (level: number) => void
}

export function QuestionLevelTabs({
  activeLevels,
  questions,
  activeTab,
  setActiveTab,
}: QuestionLevelTabsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {activeLevels.map((level) => {
        const levelQuestionsCount = questions.filter(q => q.level === level.level).length
        return (
          <button
            key={level.level}
            type="button"
            onClick={() => setActiveTab(level.level)}
            className={cn(
              "px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer shadow-sm",
              activeTab === level.level
                ? "bg-[#2563EB] text-white ring-1 ring-blue-500 font-extrabold"
                : "bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200"
            )}
          >
            LEVEL {level.level}{" "}
            <span className={cn(
              "ml-1 text-[10px] px-1.5 py-0.2 rounded-full",
              activeTab === level.level ? "bg-white/20 text-white" : "bg-slate-200 text-slate-500"
            )}>
              {levelQuestionsCount}
            </span>
          </button>
        )
      })}
    </div>
  )
}
