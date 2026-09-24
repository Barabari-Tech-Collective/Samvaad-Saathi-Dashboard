import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface TagBadgeProps {
  tag: string
  className?: string
}

const TAG_COLORS: Record<string, string> = {
  "active": "bg-violet-100 text-violet-800 border-violet-200 dark:bg-violet-500/20 dark:text-violet-300 dark:border-violet-500/30",
  "top performing": "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30",
  "most popular": "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-500/20 dark:text-rose-300 dark:border-rose-500/30",
  "most active": "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-500/20 dark:text-orange-300 dark:border-orange-500/30",
}

export function TagBadge({ tag, className }: TagBadgeProps) {
  const lowerTag = tag.toLowerCase()
  const colorClass = TAG_COLORS[lowerTag] || "bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-500/20 dark:text-indigo-300 dark:border-indigo-500/30"

  return (
    <Badge 
      variant="secondary" 
      className={cn(
        "text-[10px] normal-case border",
        colorClass,
        className
      )}
    >
      {tag}
    </Badge>
  )
}
