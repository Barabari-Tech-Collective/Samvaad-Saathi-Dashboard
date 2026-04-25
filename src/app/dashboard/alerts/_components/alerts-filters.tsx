import * as React from "react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const EMPTY = "__all__"

interface AlertsFiltersProps {
  role: string | undefined
  setRole: (role: string | undefined) => void
  difficulty: string | undefined
  setDifficulty: (difficulty: string | undefined) => void
}

export function AlertsFilters({ role, setRole, difficulty, setDifficulty }: AlertsFiltersProps) {
  return (
    <div className="grid grid-cols-1 gap-3 px-4 md:grid-cols-2 lg:px-6">
      <div className="space-y-1 max-w-sm">
        <Label>Role</Label>
        <Input
          placeholder="e.g. react developer"
          value={role ?? ""}
          onChange={(e) => setRole(e.target.value || undefined)}
        />
      </div>
      <div className="space-y-1 max-w-sm">
        <Label>Difficulty</Label>
        <Select
          value={difficulty ?? EMPTY}
          onValueChange={(value) => setDifficulty(value === EMPTY ? undefined : value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All difficulties" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={EMPTY}>All difficulties</SelectItem>
            <SelectItem value="easy">Easy</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="hard">Hard</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
