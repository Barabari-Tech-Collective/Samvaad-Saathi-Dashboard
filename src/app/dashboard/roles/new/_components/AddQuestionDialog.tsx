import { IconX } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

interface AddQuestionDialogProps {
  isOpen: boolean
  onClose: () => void
  modalText: string
  setModalText: (text: string) => void
  modalCategory: string
  setModalCategory: (category: string) => void
  modalDifficulty: string
  setModalDifficulty: (difficulty: string) => void
  onAdd: () => void
}

export function AddQuestionDialog({
  isOpen,
  onClose,
  modalText,
  setModalText,
  modalCategory,
  setModalCategory,
  modalDifficulty,
  setModalDifficulty,
  onAdd,
}: AddQuestionDialogProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <Card className="w-full max-w-md border border-slate-200 rounded-2xl shadow-xl bg-white animate-in zoom-in-95 duration-200">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b">
            <h3 className="font-bold text-slate-800 text-base">Add New Question</h3>
            <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 cursor-pointer">
              <IconX className="size-4" />
            </button>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600">Question Text</label>
            <Textarea
              value={modalText}
              onChange={(e) => setModalText(e.target.value)}
              placeholder="e.g. Write a complex state hook..."
              className="min-h-[80px] text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 rounded-lg p-2.5 resize-none border border-slate-200"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600">Category</label>
              <select
                value={modalCategory}
                onChange={(e) => setModalCategory(e.target.value)}
                className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-white outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="THEORETICAL">Theoretical</option>
                <option value="PRACTICAL">Practical</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600">Difficulty</label>
              <select
                value={modalDifficulty}
                onChange={(e) => setModalDifficulty(e.target.value)}
                className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-white outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t mt-4">
            <Button type="button" variant="ghost" onClick={onClose} className="text-xs h-9">
              Cancel
            </Button>
            <Button type="button" onClick={onAdd} className="bg-[#2563EB] hover:bg-blue-700 text-white text-xs h-9 font-bold px-4 rounded-lg">
              Add Question
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
