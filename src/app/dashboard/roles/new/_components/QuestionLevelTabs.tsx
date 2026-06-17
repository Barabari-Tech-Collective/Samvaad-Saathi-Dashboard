import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
    <Tabs
      value={activeTab.toString()}
      onValueChange={(val) => {
        const parsed = parseInt(val, 10)
        if (!isNaN(parsed)) {
          setActiveTab(parsed)
        }
      }}
      className="w-full md:w-auto"
    >
      <TabsList className="bg-transparent p-0 flex flex-wrap gap-2 h-auto w-full md:w-auto">
        {activeLevels.map((level) => {
          const levelQuestionsCount = questions.filter(
            (q) => q.level === level.level
          ).length
          const isSelected = activeTab === level.level

          return (
            <TabsTrigger
              key={level.level}
              value={level.level.toString()}
              className={cn(
                "px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer shadow-sm border h-auto",
                "focus-visible:ring-0 focus-visible:ring-offset-0",
                "data-active:shadow-sm data-[state=active]:shadow-sm",
                isSelected
                  ? "bg-[#2563EB] text-white border-blue-500 hover:bg-blue-600 hover:text-white data-[state=active]:bg-[#2563EB] data-[state=active]:text-white data-[state=active]:border-blue-500 data-active:bg-[#2563EB] data-active:text-white data-active:border-blue-500 font-extrabold"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200 data-[state=active]:bg-[#2563EB] data-[state=active]:text-white data-[state=active]:border-blue-500 data-active:bg-[#2563EB] data-active:text-white data-active:border-blue-500"
              )}
            >
              LEVEL {level.level}{" "}
              <span
                className={cn(
                  "ml-1 text-[10px] px-1.5 py-0.2 rounded-full",
                  isSelected
                    ? "bg-white/20 text-white"
                    : "bg-slate-200 text-slate-500"
                )}
              >
                {levelQuestionsCount}
              </span>
            </TabsTrigger>
          )
        })}
      </TabsList>
    </Tabs>
  )
}
