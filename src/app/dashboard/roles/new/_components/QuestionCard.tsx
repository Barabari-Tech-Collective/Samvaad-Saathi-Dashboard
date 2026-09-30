import { IconSparkles } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { QuestionActions } from "./QuestionActions"
import { QuestionDetails } from "./QuestionDetails"
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"

interface QuestionCardProps {
  question: any
  index: number
  isExpanded: boolean
  onToggleExpand: () => void
  onEdit: () => void
  onRegenerate: () => void
  onDelete: () => void
  details: any
}

export const getCategoryBadgeStyle = (cat: string) => {
  const categoryStr = (cat || "").toLowerCase()
  if (categoryStr.includes("tech")) {
    return "bg-blue-50 text-blue-700 border-blue-200"
  } else if (categoryStr.includes("behavioral")) {
    return "bg-amber-50 text-amber-700 border-amber-200"
  } else if (categoryStr.includes("data") || categoryStr.includes("querying")) {
    return "bg-emerald-50 text-emerald-700 border-emerald-200"
  } else if (categoryStr.includes("analysis") || categoryStr.includes("insights")) {
    return "bg-purple-50 text-purple-700 border-purple-200"
  } else if (categoryStr.includes("design")) {
    return "bg-pink-50 text-pink-700 border-pink-200"
  }
  return "bg-slate-50 text-slate-700 border-slate-200" // Default fallback
}

export function QuestionCard({
  question,
  index,
  isExpanded,
  onToggleExpand,
  onEdit,
  onRegenerate,
  onDelete,
  details,
}: QuestionCardProps) {
  return (
    <AccordionItem
      value={question.id}
      className={cn(
        "border rounded-2xl p-5 bg-white transition-all duration-200 flex flex-col gap-4 shadow-sm",
        isExpanded ? "border-[#2563EB]/45 ring-1 ring-blue-500/10 shadow-md" : "border-slate-200 hover:border-blue-200 hover:shadow-md"
      )}
    >
      {/* Top Row: Question content and inline actions */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 w-full select-none">
        <AccordionTrigger
          className="flex-1 hover:no-underline p-0 border-none outline-none focus-visible:ring-0 after:display-none [&_[data-slot=accordion-trigger-icon]]:hidden text-left"
        >
          <div className="flex items-start gap-4 flex-1">
            {/* Circle number */}
            <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 font-bold text-xs mt-0.5 select-none">
              {index + 1}
            </div>

            <div className="space-y-1.5 flex-1">
              {/* Show badges ONLY when COLLAPSED */}
              {!isExpanded && (
                <div className="flex flex-wrap items-center gap-1.5">
                  <Badge variant="outline" className={cn("text-[10px] font-bold px-2.5 py-0.5 select-none rounded-full capitalize", getCategoryBadgeStyle(question.category))}>
                    {question.category?.replace('_', ' ')}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[10px] font-bold px-2.5 py-0.5 select-none rounded-full border-none",
                      question.difficulty === "EASY" && "bg-emerald-50 text-emerald-700",
                      question.difficulty === "MEDIUM" && "bg-amber-50 text-amber-700",
                      question.difficulty === "HARD" && "bg-rose-50 text-rose-700"
                    )}
                  >
                    {question.difficulty}
                  </Badge>
                  {question.isAiGenerated && (
                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-100 text-[10px] font-bold px-2.5 py-0.5 select-none rounded-full flex items-center gap-1">
                      <IconSparkles className="size-3 text-purple-600" /> AI generated
                    </Badge>
                  )}
                </div>
              )}

              <p className="text-sm font-semibold text-slate-800 leading-relaxed pr-6 select-text">
                {question.text}
              </p>
            </div>
          </div>
        </AccordionTrigger>

        {/* Actions on the Right are outside AccordionTrigger to avoid accidental toggle clicks */}
        <QuestionActions
          isExpanded={isExpanded}
          onToggleExpand={onToggleExpand}
          onEdit={onEdit}
          onRegenerate={onRegenerate}
          onDelete={onDelete}
        />
      </div>

      {/* Expanded details inside AccordionContent wrapper */}
      <AccordionContent className="p-0 border-none">
        <QuestionDetails details={details} />
      </AccordionContent>
    </AccordionItem>
  )
}
