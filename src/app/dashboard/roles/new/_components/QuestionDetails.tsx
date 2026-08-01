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
    <div className="pt-5 border-t border-slate-100 grid grid-cols-1 md:grid-cols-4 gap-6 animate-in slide-in-from-top-2 duration-200">
      {/* Column 1: Keywords */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5 text-[#2563EB] font-bold text-xs uppercase tracking-wider select-none">
          <IconKey className="size-4 text-[#2563EB]" />
          Keywords
        </div>
        <div className="flex flex-wrap gap-1.5">
          {details.keywords.map(kw => (
            <Badge
              key={kw}
              variant="outline"
              className="bg-[#EFF6FF] text-[#2563EB] border-none text-[11px] font-bold px-2.5 py-0.5 rounded-md"
            >
              {kw}
            </Badge>
          ))}
        </div>
      </div>

      {/* Column 2: Concepts Covered */}
      <div className="space-y-3 pl-0 md:pl-6 border-l-0 md:border-l border-slate-100">
        <div className="flex items-center gap-1.5 text-[#7C3AED] font-bold text-xs uppercase tracking-wider select-none">
          <IconBulb className="size-4 text-[#7C3AED]" />
          Concepts Covered
        </div>
        <ul className="space-y-1.5 text-slate-600 text-xs font-semibold leading-relaxed list-disc pl-4">
          {details.concepts.map(concept => (
            <li key={concept} className="hover:text-slate-800 transition-colors">
              {concept}
            </li>
          ))}
        </ul>
      </div>

      {/* Column 3: Expected Answer */}
      <div className="space-y-3 pl-0 md:pl-6 border-l-0 md:border-l border-slate-100">
        <div className="flex items-center gap-1.5 text-[#D97706] font-bold text-xs uppercase tracking-wider select-none">
          <IconFileText className="size-4 text-[#D97706]" />
          Expected Answer
        </div>
        <p className="text-slate-600 text-xs font-semibold leading-relaxed select-text">
          {details.expectedAnswer}
        </p>
      </div>

      {/* Column 4: Example / Expected Output */}
      <div className="space-y-3 pl-0 md:pl-6 border-l-0 md:border-l border-slate-100">
        <div className="flex items-center gap-1.5 text-[#059669] font-bold text-xs uppercase tracking-wider select-none">
          <IconCheck className="size-4 text-[#059669]" />
          Example / Expected Output
        </div>
        <p className="text-slate-600 text-xs font-semibold leading-relaxed select-text">
          {details.exampleOutput}
        </p>
      </div>
    </div>
  )
}
