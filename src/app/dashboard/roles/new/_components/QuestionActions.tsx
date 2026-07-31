import {
  IconChevronDown,
  IconChevronUp,
  IconPencil,
  IconRefresh,
  IconTrash,
} from "@tabler/icons-react"

interface QuestionActionsProps {
  isExpanded: boolean
  onToggleExpand: () => void
  onEdit: () => void
  onRegenerate: () => void
  onDelete: () => void
}

export function QuestionActions({
  isExpanded,
  onToggleExpand,
  onEdit,
  onRegenerate,
  onDelete,
}: QuestionActionsProps) {
  return (
    <div className="flex items-center gap-4 shrink-0 self-end md:self-auto border-t md:border-t-0 pt-2 md:pt-0 w-full md:w-auto justify-end md:justify-start">
      <button
        type="button"
        onClick={onEdit}
        className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors cursor-pointer py-1 px-1.5 rounded hover:bg-slate-50"
      >
        <IconPencil className="size-3.5 text-slate-500" />
        Edit
      </button>

      <button
        type="button"
        onClick={onRegenerate}
        className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-purple-600 transition-colors cursor-pointer py-1 px-1.5 rounded hover:bg-slate-50"
      >
        <IconRefresh className="size-3.5 text-slate-500" />
        Regenerate
      </button>

      <button
        type="button"
        onClick={onDelete}
        className="inline-flex items-center gap-1 text-xs font-bold text-red-500 hover:text-red-700 transition-colors cursor-pointer py-1 px-1.5 rounded hover:bg-red-50"
      >
        <IconTrash className="size-3.5 text-red-500" />
        Delete
      </button>

      {/* Arrow Button */}
      <button
        type="button"
        onClick={onToggleExpand}
        className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-50 cursor-pointer transition-colors"
      >
        {isExpanded ? (
          <IconChevronUp className="size-4 text-slate-500" />
        ) : (
          <IconChevronDown className="size-4 text-slate-500" />
        )}
      </button>
    </div>
  )
}
