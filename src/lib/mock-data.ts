// ---------------------------------------------------------------------------
// Mock data for the Samvaad Saathi admin dashboard
// Aligned with docs/REQUIREMENTS.md analytics blueprint
// ---------------------------------------------------------------------------

// ── Overview KPIs ──────────────────────────────────────────────────────────

export const overviewKpis = {
  totalUsers: 1_248,
  activeUsers: 876,
  avgScore: 72.4,
  improvementPct: 18.3,
  totalInterviews: 4_320,
  avgCompletionRate: 84.6,
  practiceComplianceRate: 61.2,
  avgImprovementRate: 8.7,
}

// ── Overview time-series (score trend over 90 days) ────────────────────────

export type OverviewTimePoint = {
  date: string
  avgScore: number
  activeUsers: number
  interviewCount: number
}

function generateDailyScores(days: number): OverviewTimePoint[] {
  const data: OverviewTimePoint[] = []
  const base = new Date("2024-04-01")
  for (let i = 0; i < days; i++) {
    const d = new Date(base)
    d.setDate(d.getDate() + i)
    data.push({
      date: d.toISOString().slice(0, 10),
      avgScore: +(65 + Math.random() * 15 + i * 0.06).toFixed(1),
      activeUsers: Math.round(40 + Math.random() * 30 + i * 0.3),
      interviewCount: Math.round(35 + Math.random() * 55 + i * 0.4),
    })
  }
  return data
}

export const overviewTimeSeries = generateDailyScores(91)

// ── Top / Struggling / Most-Improved Students ──────────────────────────────

export interface StudentRow {
  id: string
  name: string
  college: string
  role: string
  latestScore: number
  avgScore: number
  bestScore: number
  improvementRate: number
  interviewCount: number
  weakAreas: string[]
  consistency: "Stable" | "Fluctuating" | "Improving"
  practiceCompliance: number
  lastActive: string
  registeredAt: string
}

export const colleges = [
  "IIT Delhi",
  "BITS Pilani",
  "NIT Trichy",
  "VIT Vellore",
  "NSUT Delhi",
  "DTU Delhi",
  "IIIT Hyderabad",
  "COEP Pune",
] as const
const roles = ["Frontend", "Backend", "Fullstack", "Data Science", "DevOps", "Mobile", "ML Engineer", "QA"]
const weakAreaPool = ["High filler usage", "Low energy", "Poor structure", "Too short answers", "Low technical accuracy", "Weak examples", "Inconsistent pace", "Low relevance"]

function pickRandom<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

function generateStudents(n: number): StudentRow[] {
  return Array.from({ length: n }, (_, i) => {
    const first = 40 + Math.random() * 30
    const latest = first + (Math.random() - 0.3) * 25
    const best = Math.max(latest, first) + Math.random() * 10
    return {
      id: `STU-${String(i + 1).padStart(4, "0")}`,
      name: `Student ${i + 1}`,
      college: colleges[i % colleges.length],
      role: roles[i % roles.length],
      latestScore: +latest.toFixed(1),
      avgScore: +((first + latest + best) / 3).toFixed(1),
      bestScore: +Math.min(best, 100).toFixed(1),
      improvementRate: +(latest - first).toFixed(1),
      interviewCount: Math.round(3 + Math.random() * 15),
      weakAreas: pickRandom(weakAreaPool, 1 + Math.floor(Math.random() * 3)),
      consistency: (["Stable", "Fluctuating", "Improving"] as const)[Math.floor(Math.random() * 3)],
      practiceCompliance: +(30 + Math.random() * 70).toFixed(0) as unknown as number,
      lastActive: new Date(Date.now() - Math.random() * 30 * 86_400_000).toISOString().slice(0, 10),
      registeredAt: new Date(Date.now() - Math.random() * 90 * 86_400_000).toISOString().slice(0, 10),
    }
  })
}

export const students = generateStudents(60)

export const topStudents = [...students].sort((a, b) => b.latestScore - a.latestScore).slice(0, 10)
export const strugglingStudents = [...students].sort((a, b) => a.latestScore - b.latestScore).slice(0, 10)
export const mostImprovedStudents = [...students].sort((a, b) => b.improvementRate - a.improvementRate).slice(0, 10)

// ── Student skill breakdown (radar chart data) ────────────────────────────

export const studentSkillBreakdown = {
  speech: [
    { metric: "WPM", value: 74 },
    { metric: "Pause Score", value: 68 },
    { metric: "Filler Density", value: 55 },
    { metric: "Energy", value: 80 },
    { metric: "Consistency", value: 72 },
  ],
  knowledge: [
    { metric: "Technical Accuracy", value: 78 },
    { metric: "Structure Quality", value: 65 },
    { metric: "Relevance", value: 82 },
    { metric: "Examples", value: 60 },
  ],
}

// ── Interviews / Sessions ──────────────────────────────────────────────────

export interface InterviewRow {
  id: string
  studentId: string
  studentName: string
  college: string
  role: string
  difficulty: "Easy" | "Medium" | "Hard"
  totalScore: number
  speechScore: number
  knowledgeScore: number
  duration: number
  completionRate: number
  questionCount: number
  followUpTriggered: number
  date: string
}

function generateInterviews(n: number): InterviewRow[] {
  return Array.from({ length: n }, (_, i) => {
    const stu = students[i % students.length]
    const speech = +(50 + Math.random() * 45).toFixed(1)
    const knowledge = +(45 + Math.random() * 50).toFixed(1)
    return {
      id: `INT-${String(i + 1).padStart(5, "0")}`,
      studentId: stu.id,
      studentName: stu.name,
      college: stu.college,
      role: roles[i % roles.length],
      difficulty: (["Easy", "Medium", "Hard"] as const)[Math.floor(Math.random() * 3)],
      totalScore: +((speech + knowledge) / 2).toFixed(1),
      speechScore: speech,
      knowledgeScore: knowledge,
      duration: Math.round(8 + Math.random() * 22),
      completionRate: +(70 + Math.random() * 30).toFixed(0) as unknown as number,
      questionCount: Math.round(4 + Math.random() * 6),
      followUpTriggered: Math.round(Math.random() * 4),
      date: new Date(Date.now() - Math.random() * 90 * 86_400_000).toISOString().slice(0, 10),
    }
  })
}

export const interviews = generateInterviews(200)

export const recentInterviews = [...interviews]
  .sort((a, b) => b.date.localeCompare(a.date))
  .slice(0, 10)

export const recentlyAddedStudents = [...students]
  .sort((a, b) => b.registeredAt.localeCompare(a.registeredAt))
  .slice(0, 10)

export const interviewsCountByRole = roles.map((role) => ({
  role,
  count: interviews.filter((i) => i.role === role).length,
}))

function modeValue<T extends string>(values: readonly T[]): T {
  const counts = new Map<T, number>()
  for (const v of values) counts.set(v, (counts.get(v) ?? 0) + 1)
  let best = values[0]!
  let n = 0
  for (const [k, v] of counts) {
    if (v > n) {
      n = v
      best = k
    }
  }
  return best
}

export const mockPopularInterviewRole = modeValue(interviews.map((i) => i.role))
export const mockPopularInterviewDifficulty = modeValue(interviews.map((i) => i.difficulty))
export const mockAvgInterviewDuration = +(
  interviews.reduce((acc, i) => acc + i.duration, 0) / interviews.length
).toFixed(1)

export type CollegeSummaryRow = {
  college: string
  studentsCount: number
  interviewsCount: number
  avgScore: number
  improvementPct: number
  activeUsersLast30d: number
}

function buildCollegesSummary(): CollegeSummaryRow[] {
  const boundary = new Date()
  boundary.setDate(boundary.getDate() - 30)
  const boundaryStr = boundary.toISOString().slice(0, 10)
  return colleges.map((collegeName) => {
    const cohort = students.filter((s) => s.college === collegeName)
    const stuIds = new Set(cohort.map((s) => s.id))
    const iv = interviews.filter((i) => stuIds.has(i.studentId))
    const activeUsersLast30d = cohort.filter((s) => s.lastActive >= boundaryStr).length
    const studentsCount = cohort.length
    const interviewsCount = iv.length
    const avgScore =
      studentsCount > 0
        ? +(cohort.reduce((acc, s) => acc + s.avgScore, 0) / studentsCount).toFixed(1)
        : 0
    const improvementPct =
      studentsCount > 0
        ? +(cohort.reduce((acc, s) => acc + s.improvementRate, 0) / studentsCount).toFixed(1)
        : 0
    return {
      college: collegeName,
      studentsCount,
      interviewsCount,
      avgScore,
      improvementPct,
      activeUsersLast30d,
    }
  })
}

export const collegesSummary = buildCollegesSummary()

export const interviewsByDifficulty = [
  { difficulty: "Easy", avgScore: 78.2, completionRate: 92, count: 68 },
  { difficulty: "Medium", avgScore: 69.5, completionRate: 84, count: 82 },
  { difficulty: "Hard", avgScore: 58.1, completionRate: 71, count: 50 },
]

export const questionTypePerformance = [
  { type: "Technical", avgKnowledge: 72, avgSpeech: 68, followUpPct: 42 },
  { type: "Tech-Allied", avgKnowledge: 76, avgSpeech: 74, followUpPct: 28 },
  { type: "Behavioral", avgKnowledge: 81, avgSpeech: 79, followUpPct: 18 },
]

// ── Segment-level analytics ────────────────────────────────────────────────

export const segmentByRole = roles.map((role) => ({
  role,
  avgScore: +(55 + Math.random() * 30).toFixed(1),
  dropOffRate: +(5 + Math.random() * 25).toFixed(1),
  commonWeakness: pickRandom(weakAreaPool, 2),
  avgTimeSpent: +(10 + Math.random() * 15).toFixed(1),
  improvementRate: +(-2 + Math.random() * 20).toFixed(1),
}))

export const segmentByCollege = colleges.map((college) => ({
  college,
  avgScore: +(55 + Math.random() * 30).toFixed(1),
  improvementRate: +(-3 + Math.random() * 22).toFixed(1),
  usageFrequency: +(2 + Math.random() * 8).toFixed(1),
  completionRate: +(60 + Math.random() * 35).toFixed(1),
  studentCount: Math.round(20 + Math.random() * 80),
}))

export const segmentByDifficulty = [
  { level: "Easy", avgScore: 79.3, completionRate: 93.1, retryRate: 12.4 },
  { level: "Medium", avgScore: 68.7, completionRate: 82.5, retryRate: 24.6 },
  { level: "Hard", avgScore: 56.2, completionRate: 68.9, retryRate: 38.1 },
]

// ── Product / System analytics ─────────────────────────────────────────────

export const funnelData = [
  { stage: "Sign Up", users: 1248 },
  { stage: "Select Role", users: 1105 },
  { stage: "Start Interview", users: 943 },
  { stage: "Complete Interview", users: 796 },
  { stage: "View Report", users: 684 },
  { stage: "Do Practice", users: 421 },
]

export const reportUsage = {
  openRate: 86.2,
  avgTimeOnReport: 4.3,
  recommendationClickRate: 34.7,
}

export const practiceEffectiveness = [
  { exercise: "Filler Reduction", preScore: 52, postScore: 71, usage: 312 },
  { exercise: "Structure Drills", preScore: 48, postScore: 67, usage: 287 },
  { exercise: "Energy Boost", preScore: 61, postScore: 75, usage: 198 },
  { exercise: "Technical Depth", preScore: 55, postScore: 72, usage: 245 },
  { exercise: "Example Building", preScore: 44, postScore: 63, usage: 176 },
]

export const retryBehavior = {
  avgRetriesBeforeImprovement: 2.4,
  spamRetryPct: 11.3,
  retryDistribution: [
    { retries: 1, users: 320 },
    { retries: 2, users: 245 },
    { retries: 3, users: 156 },
    { retries: 4, users: 87 },
    { retries: "5+", users: 68 },
  ],
}

export const questionEffectiveness = [
  { question: "Explain REST vs GraphQL", avgScore: 72, dropOffPct: 8 },
  { question: "Design a cache system", avgScore: 54, dropOffPct: 22 },
  { question: "Tell me about yourself", avgScore: 81, dropOffPct: 3 },
  { question: "Implement a linked list", avgScore: 61, dropOffPct: 15 },
  { question: "System design: URL shortener", avgScore: 58, dropOffPct: 19 },
  { question: "Describe conflict resolution", avgScore: 78, dropOffPct: 5 },
]

// ── Scoring analytics ──────────────────────────────────────────────────────

export const scoreDistribution = [
  { range: "0-20", count: 12 },
  { range: "21-40", count: 45 },
  { range: "41-60", count: 187 },
  { range: "61-80", count: 312 },
  { range: "81-100", count: 156 },
]

export const speechVsKnowledgeCorrelation = Array.from({ length: 50 }, () => ({
  speech: +(40 + Math.random() * 55).toFixed(1),
  knowledge: +(35 + Math.random() * 60).toFixed(1),
}))

export const scoreTrendMonthly = [
  { month: "Jan", avgScore: 62.1, speechAvg: 60.5, knowledgeAvg: 63.7 },
  { month: "Feb", avgScore: 64.8, speechAvg: 63.2, knowledgeAvg: 66.4 },
  { month: "Mar", avgScore: 67.3, speechAvg: 65.8, knowledgeAvg: 68.8 },
  { month: "Apr", avgScore: 69.1, speechAvg: 67.9, knowledgeAvg: 70.3 },
  { month: "May", avgScore: 71.6, speechAvg: 70.2, knowledgeAvg: 73.0 },
  { month: "Jun", avgScore: 72.4, speechAvg: 71.1, knowledgeAvg: 73.7 },
]

// ── Alerts ──────────────────────────────────────────────────────────────────

export interface AlertItem {
  id: string
  type: "student" | "system"
  severity: "critical" | "warning" | "info"
  title: string
  description: string
  timestamp: string
  studentId?: string
}

export const alerts: AlertItem[] = [
  { id: "A-001", type: "student", severity: "critical", title: "No improvement after 5 attempts", description: "Student 12 (BITS Pilani) has not improved across the last 5 interviews. Score stuck at ~48.", timestamp: "2024-06-28", studentId: "STU-0012" },
  { id: "A-002", type: "student", severity: "warning", title: "High filler + low energy combo", description: "Student 27 shows consistently high filler density (>12%) combined with low energy scores (<45).", timestamp: "2024-06-27", studentId: "STU-0027" },
  { id: "A-003", type: "student", severity: "warning", title: "Too many retries without progress", description: "Student 8 has retried 7 times in the last 2 weeks with <2 point improvement.", timestamp: "2024-06-26", studentId: "STU-0008" },
  { id: "A-004", type: "system", severity: "critical", title: "Sudden score drop in Backend role", description: "Average score for Backend interviews dropped 15 points this week. Possible question or grading issue.", timestamp: "2024-06-29" },
  { id: "A-005", type: "system", severity: "warning", title: "High failure rate in Hard difficulty", description: "Completion rate for Hard difficulty fell below 65% — lowest in 3 months.", timestamp: "2024-06-28" },
  { id: "A-006", type: "system", severity: "info", title: "NIT Trichy performing extremely low", description: "Average score for NIT Trichy students is 18 points below the platform average. May need targeted intervention.", timestamp: "2024-06-27" },
  { id: "A-007", type: "student", severity: "info", title: "Low practice compliance", description: "Student 41 has completed only 1 out of 8 recommended exercises.", timestamp: "2024-06-25", studentId: "STU-0041" },
  { id: "A-008", type: "system", severity: "warning", title: "Question causing high drop-off", description: "'Design a cache system' has a 22% drop-off rate — highest across all questions.", timestamp: "2024-06-26" },
]

export const studentAttentionAlerts = alerts.filter((a) => a.type === "student").slice(0, 8)

export function getStudentById(id: string): StudentRow | undefined {
  return students.find((s) => s.id === id)
}

export function countActiveStudentsLast30d(): number {
  const boundary = new Date()
  boundary.setDate(boundary.getDate() - 30)
  const boundaryStr = boundary.toISOString().slice(0, 10)
  return students.filter((s) => s.lastActive >= boundaryStr).length
}
