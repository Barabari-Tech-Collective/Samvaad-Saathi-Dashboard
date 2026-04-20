/** Shared optional filters for dashboard charts (OpenAPI: string query params). */
export type DashboardDateRoleFilter = Readonly<{
  start_date?: string
  end_date?: string
  role?: string
  difficulty?: string
  college?: string
}>

export type PaginationParams = Readonly<{
  page?: number
  limit?: number
}>

export type StudentsTableParams = PaginationParams &
  Readonly<{
    q?: string
    college?: string
  }>

export type StudentsSearchParams = PaginationParams &
  Readonly<{
    q: string
    college?: string
  }>

export type InterviewsTableParams = PaginationParams &
  DashboardDateRoleFilter

export type DateRangeParams = Readonly<{
  start_date?: string
  end_date?: string
}>

export type StudentDetailDateParams = DateRangeParams

export type DashboardRecentParams = Readonly<{
  limit?: number
  start_date?: string
  end_date?: string
}>

export type DashboardTopParams = DashboardDateRoleFilter &
  Readonly<{
    limit?: number
  }>

export type DashboardAttentionParams = Readonly<{
  limit?: number
  start_date?: string
  end_date?: string
}>

export type AnalyticsSearchParams = Readonly<{
  q: string
  limit_per_bucket?: number
}>

export type ForecastingParams = Readonly<{
  days_ahead?: number
}>

/** —— Response shapes (aligned with analytics-v2 JSON) —— */

export type KpiItem = Readonly<{
  key: string
  label: string
  value: number | string | null
  unit: string | null
}>

export type KpiResponse = Readonly<{
  kpis: readonly KpiItem[]
}>

export type ChartPoint = Readonly<{
  date: string
  value: number
}>

export type LineAreaChartResponse = Readonly<{
  chartType: "line" | "area"
  points: readonly ChartPoint[]
}>

export type HistogramBucket = Readonly<{
  label: string
  count: number
}>

export type HistogramResponse = Readonly<{
  chartType: "histogram"
  buckets: readonly HistogramBucket[]
}>

export type TopRoleRow = Readonly<{
  role: string
  interviews: number
  avg_score: number | null
  drop_off_rate: number | null
  common_weaknesses: readonly string[]
  avg_time_spent_seconds?: number | null
}>

export type TopRolesTableResponse = Readonly<{
  tableType: "top_roles"
  items: readonly TopRoleRow[]
}>

export type TopCollegeRow = Readonly<{
  college: string
  interviews: number
  avg_score: number | null
  improvement_rate: number | null
  usage_frequency: number
  completion_rate: number
}>

export type TopCollegesTableResponse = Readonly<{
  tableType: "top_colleges"
  items: readonly TopCollegeRow[]
}>

export type RecentInterviewRow = Readonly<{
  interview_id: number
  student_id?: number
  student_name: string
  college?: string | null
  role: string
  difficulty: string
  score: number | null
  duration_seconds: number | null
  date: string
  status?: string
}>

export type RecentInterviewsResponse = Readonly<{
  tableType: "recent_interviews"
  items: readonly RecentInterviewRow[]
  page?: number
  limit?: number
  total?: number
}>

export type RecentStudentRow = Readonly<{
  student_id: number
  name: string
  email: string
  college: string | null
  target_position: string | null
  created_at: string
}>

export type RecentStudentsResponse = Readonly<{
  tableType: "recent_students"
  items: readonly RecentStudentRow[]
  page?: number
  limit?: number
  total?: number
}>

export type AttentionItem = Readonly<{
  entity_type: string
  severity: string
  type: string
  user_id: number
  message: string
}>

export type AttentionRequiredResponse = Readonly<{
  tableType: "attention_required"
  items: readonly AttentionItem[]
  page?: number
  limit?: number
  total?: number
}>

export type StudentsSummaryResponse = KpiResponse & Readonly<{ tableType?: string }>

export type StudentTableRow = Readonly<{
  student_id: number
  name: string
  college: string
  average_score: number | null
  latest_score: number | null
  improvement_percent: number | null
  interviews_count: number
  last_active: string
}>

export type StudentsTableResponse = Readonly<{
  tableType: "students"
  items: readonly StudentTableRow[]
  page: number
  limit: number
  total: number
}>

export type CollegeFilterResponse = Readonly<{
  colleges: readonly string[]
}>

export type StudentProfileResponse = Readonly<{
  studentId: number
  name: string
  email: string
  college: string
  degree: string | null
  targetPosition: string | null
  yearsExperience: number | null
  company: string | null
  createdAt: string
  lastActive: string | null
}>

export type StudentSummaryResponse = Readonly<{
  studentId: number
  kpis: readonly KpiItem[]
}>

export type ScoreHistoryPoint = Readonly<{
  interview_id: number
  created_at: string
  overall_score: number | null
  speech_score: number | null
  knowledge_score: number | null
}>

export type StudentScoreHistoryResponse = Readonly<{
  studentId: number
  chartType: "line"
  points: readonly ScoreHistoryPoint[]
}>

export type SpeechVsKnowledgePoint = Readonly<{
  interview_id: number
  created_at: string
  speech_score: number | null
  knowledge_score: number | null
}>

export type StudentSpeechVsKnowledgeResponse = Readonly<{
  studentId: number
  chartType: "line"
  points: readonly SpeechVsKnowledgePoint[]
}>

export type SkillMetric = Readonly<{
  metric: string
  value: number | null
}>

export type StudentSkillAveragesResponse = Readonly<{
  studentId: number
  chartType: "radar"
  items: readonly SkillMetric[]
}>

export type StudentPracticeCompletionResponse = Readonly<{
  studentId: number
  kpis: readonly KpiItem[]
}>

export type StudentInterviewRow = Readonly<{
  interview_id: number
  role: string
  difficulty: string
  status: string
  score: number | null
  duration_seconds: number | null
  created_at: string
}>

export type StudentInterviewsResponse = Readonly<{
  tableType: "student_interviews"
  items: readonly StudentInterviewRow[]
  page: number
  limit: number
  total: number
}>

export type StudentLatestFeedbackResponse = Readonly<{
  studentId: number
  latestFeedback: string | null
  questionAttemptId: number | null
  interviewId: number | null
  createdAt: string | null
}>

export type CollegesSummaryResponse = KpiResponse

export type CollegeTableRow = Readonly<{
  college_name: string
  students_count: number
  interviews_count: number
  avg_score: number | null
  improvement_percent: number | null
  active_users: number
}>

export type CollegesTableResponse = Readonly<{
  tableType: "colleges"
  items: readonly CollegeTableRow[]
  page: number
  limit: number
  total: number
}>

export type InterviewsSummaryResponse = KpiResponse

export type InterviewTableRow = Readonly<{
  interview_id: number
  student_id?: number
  student_name: string
  college: string
  role: string
  difficulty: string
  score: number | null
  duration: number | null
  date: string
  status?: string
}>

export type InterviewsTableResponse = Readonly<{
  tableType: "interviews"
  items: readonly InterviewTableRow[]
  page: number
  limit: number
  total: number
}>

export type GlobalSearchResponse = Readonly<{
  students?: readonly StudentTableRow[]
  interviews?: readonly InterviewTableRow[]
  colleges?: readonly string[]
}>

export type RankingsSummaryResponse = KpiResponse

export type RankingRow = Readonly<{
  student_id: number
  name: string
  college: string
  average_score: number | null
  latest_score: number | null
  improvement_percent: number | null
  interviews_count: number
  last_active: string
}>

export type RankingsTableResponse = Readonly<{
  tableType: string
  items: readonly RankingRow[]
  page: number
  limit: number
  total: number
}>

export type RolesSummaryResponse = KpiResponse

export type RolePerformanceRow = Readonly<{
  role: string
  interviews: number
  avg_score: number | null
  drop_off_rate: number | null
  common_weaknesses: readonly string[]
}>

export type RolesPerformanceResponse = Readonly<{
  tableType: "role_performance"
  items: readonly RolePerformanceRow[]
}>

export type RolesWeakSkillsResponse = Readonly<{
  chartType: "heatmap"
  items: readonly { x: string; y: string; value: number }[]
}>

export type RoleDetailResponse = Readonly<{
  tableType: "role_detail"
  items: readonly unknown[]
}>

export type DifficultyMetricsRow = Readonly<{
  difficulty: string
  interviews: number
  avg_score: number | null
  completion_rate: number | null
  retry_rate: number | null
}>

export type DifficultyMetricsResponse = Readonly<{
  tableType: "difficulty_metrics"
  items: readonly DifficultyMetricsRow[]
}>

export type QuestionsAnalyticsResponse = Readonly<{
  tableType: "question_analytics"
  items: readonly Record<string, unknown>[]
  page: number
  limit: number
  total: number
}>

export type FunnelStage = Readonly<{
  stage: string
  count: number
  rate: number | null
}>

export type DropoffFunnelResponse = Readonly<{
  chartType: "funnel"
  stages: readonly FunnelStage[]
}>

export type PredictiveAlertRow = Readonly<{
  entity_type: string
  prediction?: string
  reason?: string
  confidence?: number
  type: string
  user_id: number
  message: string
}>

export type PredictiveAlertsResponse = Readonly<{
  tableType: "predictive_alerts"
  items: readonly PredictiveAlertRow[]
}>

export type BenchmarkingResponse = Readonly<{
  tableType: "benchmarking"
  items: readonly Record<string, unknown>[]
}>

export type ForecastPoint = Readonly<{
  date: string
  predictedValue: number
  lowerBound: number
  upperBound: number
}>

export type ForecastingResponse = Readonly<{
  chartType: "line"
  points: readonly ForecastPoint[]
}>

export type InterviewDetailSummaryResponse = Readonly<{
  kpis: readonly KpiItem[]
}>

export type InterviewQuestionScoresResponse = Readonly<{
  tableType: "interview_question_scores"
  items: readonly unknown[]
  page: number
  limit: number
  total: number
}>

export type InterviewQuestionTypeBreakdownResponse = Readonly<{
  chartType: "pie"
  buckets: readonly { label: string; count: number }[]
}>

export type InterviewSpeechTimelineResponse = Readonly<{
  chartType: "line"
  points: readonly ChartPoint[]
}>
