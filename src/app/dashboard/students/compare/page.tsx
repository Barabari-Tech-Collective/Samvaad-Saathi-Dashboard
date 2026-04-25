"use client"

import * as React from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  useStudentScoreHistory,
  useStudentSkillAverages,
  useStudentsTable,
} from "@/lib/api/hooks/analytics"

const EMPTY = "__all__"
const MAX_COMPARE = 4
const COLORS = ["#6366f1", "#0ea5e9", "#10b981", "#f59e0b"] as const

type CompareFilters = Readonly<{
  role?: string
  difficulty?: string
  start_date?: string
  end_date?: string
}>

function toDateLabel(value: string): string {
  if (!value) return "Unknown"
  return value.slice(0, 10)
}

function useStudentScoreMap(studentIds: readonly number[], filters: CompareFilters) {
  const datasets = studentIds.map((studentId) => ({
    studentId,
    query: useStudentScoreHistory(studentId, filters),
  }))

  const rows = React.useMemo(() => {
    const allDates = new Set<string>()
    for (const { query } of datasets) {
      for (const point of query.scoreHistory?.points ?? []) {
        allDates.add(toDateLabel(point.created_at))
      }
    }
    const sortedDates = Array.from(allDates).sort()
    return sortedDates.map((date) => {
      const row: Record<string, number | string | null> = { date }
      for (const { studentId, query } of datasets) {
        const point = (query.scoreHistory?.points ?? []).find((p) => toDateLabel(p.created_at) === date)
        row[`student_${studentId}`] = point?.overall_score ?? null
      }
      return row
    })
  }, [datasets])

  return { datasets, rows }
}

function useSkillMetricRows(studentIds: readonly number[], filters: CompareFilters) {
  const datasets = studentIds.map((studentId) => ({
    studentId,
    query: useStudentSkillAverages(studentId, filters),
  }))

  return React.useMemo(() => {
    const metrics = new Set<string>()
    for (const { query } of datasets) {
      for (const item of query.skillAverages?.items ?? []) {
        metrics.add(item.metric)
      }
    }
    return Array.from(metrics).map((metric) => {
      const row: Record<string, string | number | null> = { metric }
      for (const { studentId, query } of datasets) {
        const value = (query.skillAverages?.items ?? []).find((item) => item.metric === metric)?.value ?? null
        row[`student_${studentId}`] = value
      }
      return row
    })
  }, [datasets])
}

export default function StudentComparePage() {
  const [filters, setFilters] = React.useState<CompareFilters>({})
  const [query, setQuery] = React.useState("")
  const [selectedStudents, setSelectedStudents] = React.useState<number[]>([])

  const { studentsTable, isLoadingStudentsTable } = useStudentsTable({
    q: query || undefined,
    role: filters.role,
    difficulty: filters.difficulty,
    start_date: filters.start_date,
    end_date: filters.end_date,
    limit: 30,
    page: 1,
  })

  const candidateStudents = studentsTable?.items ?? []
  const { rows: scoreRows } = useStudentScoreMap(selectedStudents, filters)
  const skillRows = useSkillMetricRows(selectedStudents, filters)

  const toggleStudent = React.useCallback((studentId: number) => {
    setSelectedStudents((prev) => {
      if (prev.includes(studentId)) {
        return prev.filter((id) => id !== studentId)
      }
      if (prev.length >= MAX_COMPARE) return prev
      return [...prev, studentId]
    })
  }, [])

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="px-4 lg:px-6">
        <h1 className="text-lg font-semibold tracking-tight">Student Compare</h1>
        <p className="text-sm text-muted-foreground">
          Compare student performance trends over time by role and difficulty.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 px-4 md:grid-cols-2 lg:grid-cols-5 lg:px-6">
        <div className="space-y-1">
          <Label>Search student</Label>
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="name..."
            autoComplete="off"
          />
        </div>
        <div className="space-y-1">
          <Label>Role</Label>
          <Input
            value={filters.role ?? ""}
            onChange={(e) => setFilters((prev) => ({ ...prev, role: e.target.value || undefined }))}
            placeholder="react developer"
          />
        </div>
        <div className="space-y-1">
          <Label>Difficulty</Label>
          <Select
            value={filters.difficulty ?? EMPTY}
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, difficulty: value === EMPTY ? undefined : value }))
            }
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
        <div className="space-y-1">
          <Label>Start date</Label>
          <Input
            type="date"
            value={filters.start_date ?? ""}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                start_date: e.target.value || undefined,
              }))
            }
          />
        </div>
        <div className="space-y-1">
          <Label>End date</Label>
          <Input
            type="date"
            value={filters.end_date ?? ""}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                end_date: e.target.value || undefined,
              }))
            }
          />
        </div>
      </div>

      <div className="px-4 lg:px-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Student picker</CardTitle>
            <CardDescription>Select up to {MAX_COMPARE} students for comparison.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {isLoadingStudentsTable ? (
              <p className="text-sm text-muted-foreground">Loading students...</p>
            ) : candidateStudents.length === 0 ? (
              <p className="text-sm text-muted-foreground">No students found for current filters.</p>
            ) : (
              candidateStudents.slice(0, 20).map((student) => {
                const selected = selectedStudents.includes(student.student_id)
                return (
                  <Button
                    key={student.student_id}
                    variant={selected ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleStudent(student.student_id)}
                    disabled={!selected && selectedStudents.length >= MAX_COMPARE}
                  >
                    {student.name}
                  </Button>
                )
              })
            )}
          </CardContent>
        </Card>
      </div>

      <div className="px-4 lg:px-6">
        <div className="flex flex-wrap gap-2">
          {selectedStudents.map((studentId, idx) => (
            <Badge key={studentId} variant="secondary">
              Student #{studentId} <span className="ml-1 inline-block h-2 w-2 rounded-full" style={{ background: COLORS[idx] }} />
            </Badge>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 px-4 lg:grid-cols-2 lg:px-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Overall score trend</CardTitle>
            <CardDescription>Line comparison by student over time.</CardDescription>
          </CardHeader>
          <CardContent className="h-[320px]">
            {selectedStudents.length === 0 ? (
              <p className="text-sm text-muted-foreground">Pick students to render trend comparison.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={scoreRows}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  {selectedStudents.map((studentId, idx) => (
                    <Line
                      key={studentId}
                      type="monotone"
                      dataKey={`student_${studentId}`}
                      name={`Student ${studentId}`}
                      stroke={COLORS[idx % COLORS.length]}
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      connectNulls
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Skill metric comparison</CardTitle>
            <CardDescription>Grouped bar view of skill averages.</CardDescription>
          </CardHeader>
          <CardContent className="h-[320px]">
            {selectedStudents.length === 0 ? (
              <p className="text-sm text-muted-foreground">Pick students to render skill comparison.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={skillRows}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="metric" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  {selectedStudents.map((studentId, idx) => (
                    <Bar
                      key={studentId}
                      dataKey={`student_${studentId}`}
                      name={`Student ${studentId}`}
                      fill={COLORS[idx % COLORS.length]}
                      radius={[3, 3, 0, 0]}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
