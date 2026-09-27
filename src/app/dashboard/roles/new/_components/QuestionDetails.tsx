import { IconBulb, IconCheck, IconFileText, IconKey } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"

interface QuestionDetailsInfo {
  keywords: string[]
  concepts: string[]
  expectedAnswer: string
  exampleOutput: string
}

interface QuestionDetailsProps {
  details: QuestionDetailsInfo
}

export function QuestionDetails({ details }: QuestionDetailsProps) {
  return (
    <div className="pt-5 border-t border-slate-100 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 animate-in slide-in-from-top-2 duration-200 bg-slate-50/50 p-4 rounded-xl mt-4">
      {/* Section 1: Keywords */}
      <div className="flex flex-col items-center space-y-3">
        <div className="flex items-center gap-1.5 text-[#2563EB] font-bold text-xs uppercase tracking-wider select-none">
          <IconKey className="size-4 text-[#2563EB]" />
          Keywords
        </div>
        <div className="flex flex-wrap justify-center gap-1.5 max-w-md">
          {details.keywords.map(kw => (
            <Badge
              key={kw}
              variant="outline"
              className="bg-[#EFF6FF] text-[#2563EB] border-none text-[11px] font-bold px-3 py-1 rounded-md shadow-sm"
            >
              {kw}
            </Badge>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="hidden md:block w-px h-12 bg-slate-200"></div>

      {/* Section 2: Concepts Covered */}
      <div className="flex flex-col items-center space-y-3">
        <div className="flex items-center gap-1.5 text-[#7C3AED] font-bold text-xs uppercase tracking-wider select-none">
          <IconBulb className="size-4 text-[#7C3AED]" />
          Concepts Covered
        </div>
        <div className="flex flex-wrap justify-center gap-1.5 max-w-md">
          {details.concepts.map(concept => (
            <Badge
              key={concept}
              variant="outline"
              className="bg-[#F3E8FF] text-[#7C3AED] border-none text-[11px] font-bold px-3 py-1 rounded-md shadow-sm"
            >
              {concept}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}
