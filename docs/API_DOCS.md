# Analytics API Documentation

Generated from `https://samvad-sathi.backend.barabaricollective.org/openapi.json`.

This document includes analytics APIs with:
- what each API is about
- available query parameters
- response example

## Analytics V1 (`/api/analytics`)

### `GET /api/analytics/alerts`

- **What this API is about:** Computed analytics alerts.
- **Available query parameters:**
- `user_id` (query, string, optional)
- `start_date` (query, string, optional)
- `end_date` (query, string, optional)
- **Response example (live sample):**
```json
{
  "filters": {
    "startDate": null,
    "endDate": null,
    "role": null,
    "difficulty": null,
    "college": null
  },
  "studentAlerts": [
    {
      "type": "NO_IMPROVEMENT_AFTER_3_ATTEMPTS",
      "user_id": 5,
      "message": "No improvement after at least 3 interviews."
    },
    {
      "type": "NO_IMPROVEMENT_AFTER_3_ATTEMPTS",
      "user_id": 118,
      "message": "No improvement after at least 3 interviews."
    },
    {
      "type": "TOO_MANY_RETRIES_WITHOUT_PROGRESS",
      "user_id": 118,
      "message": "High reattempt frequency without measurable score improvement."
    },
    "...truncated"
  ],
  "systemAlerts": [
    {
      "type": "HIGH_FAILURE_RATE_ROLE",
      "role": "javascript developer",
      "message": "High drop-off/failure rate detected for role.",
      "drop_off_rate": 100.0
    },
    {
      "type": "HIGH_FAILURE_RATE_ROLE",
      "role": "data_science",
      "message": "High drop-off/failure rate detected for role.",
      "drop_off_rate": 100.0
    },
    {
      "type": "HIGH_FAILURE_RATE_ROLE",
      "role": "react developer",
      "message": "High drop-off/failure rate detected for role.",
      "drop_off_rate": 100.0
    },
    "...truncated"
  ]
}
```

### `GET /api/analytics/interview/{interview_id}`

- **What this API is about:** Interview/session-level analytics.
- **Available query parameters:** None.
- **Path parameters:** `interview_id`.
- **Response example (200):**
```json
{
  "interviewId": 0,
  "metrics": {
    "key": {}
  }
}
```

### `POST /api/analytics/report-engagement`

- **What this API is about:** Track report engagement.
- **Available query parameters:** None.
- **Response example (200):**
```json
{}
```

### `GET /api/analytics/scoring`

- **What this API is about:** Scoring quality analytics.
- **Available query parameters:**
- `start_date` (query, string, optional)
- `end_date` (query, string, optional)
- `role` (query, string, optional)
- `difficulty` (query, string, optional)
- `college` (query, string, optional)
- **Response example (live sample):**
```json
{
  "filters": {
    "startDate": null,
    "endDate": null,
    "role": null,
    "difficulty": null,
    "college": null
  },
  "metrics": {
    "correlation": {
      "speech_vs_knowledge": -0.0461
    },
    "score_distribution": [
      {
        "range": "0-20",
        "count": 111
      },
      {
        "range": "20-40",
        "count": 36
      },
      {
        "range": "40-60",
        "count": 35
      },
      "...truncated"
    ],
    "scoring_health": {
      "n_samples": 228,
      "is_too_narrow": false,
      "note": "If most scores cluster in a narrow range (for example 70-80), scoring calibration may need review."
    }
  }
}
```

### `GET /api/analytics/segment/college`

- **What this API is about:** College-level segment analytics.
- **Available query parameters:**
- `start_date` (query, string, optional)
- `end_date` (query, string, optional)
- `role` (query, string, optional)
- `difficulty` (query, string, optional)
- `college` (query, string, optional)
- **Response example (live sample):**
```json
{
  "segment": "college",
  "filters": {
    "startDate": null,
    "endDate": null,
    "role": null,
    "difficulty": null,
    "college": null
  },
  "items": [
    {
      "college": "Test Univ",
      "interviews": 63,
      "avg_score": 66.32,
      "improvement_rate": 11.92,
      "usage_frequency": 63,
      "completion_rate": 0.0
    },
    {
      "college": "unknown",
      "interviews": 84,
      "avg_score": 0,
      "improvement_rate": 0,
      "usage_frequency": 83,
      "completion_rate": 0.0
    },
    {
      "college": "GDC Begumpet",
      "interviews": 240,
      "avg_score": 0,
      "improvement_rate": 0,
      "usage_frequency": 33,
      "completion_rate": 35.0
    },
    "...truncated"
  ]
}
```

### `GET /api/analytics/segment/difficulty`

- **What this API is about:** Difficulty-level segment analytics.
- **Available query parameters:**
- `start_date` (query, string, optional)
- `end_date` (query, string, optional)
- `role` (query, string, optional)
- `difficulty` (query, string, optional)
- `college` (query, string, optional)
- **Response example (live sample):**
```json
{
  "segment": "difficulty",
  "filters": {
    "startDate": null,
    "endDate": null,
    "role": null,
    "difficulty": null,
    "college": null
  },
  "items": [
    {
      "difficulty": "easy",
      "interviews": 239,
      "avg_score": 53.2,
      "completion_rate": 28.87,
      "retry_rate": 30.83
    },
    {
      "difficulty": "medium",
      "interviews": 333,
      "avg_score": 68.46,
      "completion_rate": 28.53,
      "retry_rate": 24.54
    },
    {
      "difficulty": "hard",
      "interviews": 17,
      "avg_score": 0,
      "completion_rate": 35.29,
      "retry_rate": 29.27
    },
    "...truncated"
  ]
}
```

### `GET /api/analytics/segment/role`

- **What this API is about:** Role-level segment analytics.
- **Available query parameters:**
- `start_date` (query, string, optional)
- `end_date` (query, string, optional)
- `role` (query, string, optional)
- `difficulty` (query, string, optional)
- `college` (query, string, optional)
- **Response example (live sample):**
```json
{
  "segment": "role",
  "filters": {
    "startDate": null,
    "endDate": null,
    "role": null,
    "difficulty": null,
    "college": null
  },
  "items": [
    {
      "role": "javascript developer",
      "interviews": 89,
      "avg_score": 66.32,
      "drop_off_rate": 100.0,
      "common_weaknesses": [
        "focus on answering the technical question directly.",
        "directly reference async/await and introduce the topic of error handling.",
        "provide a clear, concise explanation (e.g., using try/catch blocks or handling returned promises).",
        "...truncated"
      ],
      "avg_time_spent_seconds": 3
    },
    {
      "role": "data_science",
      "interviews": 47,
      "avg_score": 0,
      "drop_off_rate": 100.0,
      "common_weaknesses": [],
      "avg_time_spent_seconds": 0
    },
    {
      "role": "JavaScript Developer",
      "interviews": 64,
      "avg_score": 0,
      "drop_off_rate": 43.75,
      "common_weaknesses": [
        "rephrase technical phrases in simpler terms (e.g., instead of 'execution cycle,' say 'in the same round of javascript\u2019s processing').",
        "introduce or define jargon briefly before diving into execution order.",
        "break the question into two smaller questions: (1) how does the event loop handle promises vs. settimeout? (2) which runs first when both happen after execution of synchronous code?",
        "...truncated"
      ],
      "avg_time_spent_seconds": 320466
    },
    "...truncated"
  ]
}
```

### `GET /api/analytics/student/{user_id}`

- **What this API is about:** Student-level analytics.
- **Available query parameters:**
- `start_date` (query, string, optional)
- `end_date` (query, string, optional)
- **Path parameters:** `user_id`.
- **Response example (200):**
```json
{
  "userId": 0,
  "filters": {
    "startDate": "2026-01-01",
    "endDate": "2026-01-01",
    "role": "string",
    "difficulty": "string",
    "college": "string"
  },
  "metrics": {
    "key": {}
  }
}
```

### `GET /api/analytics/system`

- **What this API is about:** System/product-level analytics.
- **Available query parameters:**
- `start_date` (query, string, optional)
- `end_date` (query, string, optional)
- `role` (query, string, optional)
- `difficulty` (query, string, optional)
- `college` (query, string, optional)
- **Response example (live sample):**
```json
{
  "filters": {
    "startDate": null,
    "endDate": null,
    "role": null,
    "difficulty": null,
    "college": null
  },
  "metrics": {
    "overview": {
      "total_users": 374,
      "active_users_30d": 32,
      "avg_score": 66.32,
      "improvement_percent": 0.0
    },
    "funnel": {
      "sign_up": 374,
      "select_role": 26,
      "start_interview": 26,
      "complete_interview": 17,
      "view_report": 8,
      "do_practice": 60
    },
    "funnel_dropoff": {
      "signup_to_role_selection_dropoff": 93.05,
      "role_selection_to_start_interview_dropoff": 0.0,
      "start_to_complete_dropoff": 34.62,
      "complete_to_report_dropoff": 52.94,
      "report_to_practice_dropoff": -650.0
    },
    "report_usage": {
      "percent_users_open_report": 30.77,
      "time_spent_on_report_seconds": 462,
      "recommendation_clicks": 33
    },
    "practice_effectiveness": {
      "users_with_measurable_practice_effect": 0,
      "avg_score_delta_after_practice": 0,
      "positive_improvement_rate": 0
    },
    "retry_behavior": {
      "avg_retries_before_completion": 1.51,
      "high_retry_questions": 90
    },
    "question_effectiveness": {
      "low_score_questions": [
        {
          "question_id": "...",
          "question_text": "...",
          "question_type": "...",
          "score": "..."
        },
        {
          "question_id": "...",
          "question_text": "...",
          "question_type": "...",
          "score": "..."
        },
        {
          "question_id": "...",
          "question_text": "...",
          "question_type": "...",
          "score": "..."
        },
        "...truncated"
      ],
      "high_dropoff_questions": [
        {
          "question_id": "...",
          "question_text": "...",
          "question_type": "..."
        },
        {
          "question_id": "...",
          "question_text": "...",
          "question_type": "..."
        },
        {
          "question_id": "...",
          "question_text": "...",
          "question_type": "..."
        },
        "...truncated"
      ]
    }
  }
}
```

## Analytics V2 (`/api/v2/analytics`)

### `GET /api/v2/analytics/colleges`

- **What this API is about:** List colleges with metrics.
- **Available query parameters:**
- `page` (query, integer, optional) (default: `1`)
- `limit` (query, integer, optional) (default: `20`)
- **Response example (live sample):**
```json
{
  "tableType": "colleges",
  "items": [
    {
      "college_name": "Test Univ",
      "students_count": 63,
      "interviews_count": 63,
      "avg_score": 66.32,
      "improvement_percent": 11.92,
      "active_users": 63
    },
    {
      "college_name": "unknown",
      "students_count": 0,
      "interviews_count": 84,
      "avg_score": 0,
      "improvement_percent": 0,
      "active_users": 83
    },
    {
      "college_name": "GDC Begumpet",
      "students_count": 33,
      "interviews_count": 240,
      "avg_score": 0,
      "improvement_percent": 0,
      "active_users": 33
    },
    "...truncated"
  ],
  "page": 1,
  "limit": 20,
  "total": 23
}
```

### `GET /api/v2/analytics/colleges/summary`

- **What this API is about:** College analytics summary.
- **Available query parameters:** None.
- **Response example (live sample):**
```json
{
  "kpis": [
    {
      "key": "total_colleges",
      "label": "Total Colleges",
      "value": 23,
      "unit": null
    },
    {
      "key": "total_students",
      "label": "Total Students",
      "value": 374,
      "unit": null
    },
    {
      "key": "total_interviews",
      "label": "Total Interviews",
      "value": 593,
      "unit": null
    },
    "...truncated"
  ]
}
```

### `GET /api/v2/analytics/colleges/{college_name}/practice-metrics`

- **What this API is about:** College practice metrics.
- **Available query parameters:** None.
- **Path parameters:** `college_name`.
- **Response example (200):**
```json
{
  "tableType": "string",
  "items": [
    {
      "key": {}
    }
  ]
}
```

### `GET /api/v2/analytics/colleges/{college_name}/score-trend`

- **What this API is about:** College score trend.
- **Available query parameters:** None.
- **Path parameters:** `college_name`.
- **Response example (200):**
```json
{
  "chartType": "string",
  "points": [
    {
      "date": "2026-01-01",
      "value": 0
    }
  ]
}
```

### `GET /api/v2/analytics/colleges/{college_name}/student-growth`

- **What this API is about:** College student growth trend.
- **Available query parameters:** None.
- **Path parameters:** `college_name`.
- **Response example (200):**
```json
{
  "chartType": "string",
  "points": [
    {
      "date": "2026-01-01",
      "value": 0
    }
  ]
}
```

### `GET /api/v2/analytics/colleges/{college_name}/students`

- **What this API is about:** Students in a college.
- **Available query parameters:**
- `page` (query, integer, optional) (default: `1`)
- `limit` (query, integer, optional) (default: `20`)
- **Path parameters:** `college_name`.
- **Response example (200):**
```json
{
  "tableType": "string",
  "items": [
    {
      "key": {}
    }
  ],
  "page": 0,
  "limit": 0,
  "total": 0
}
```

### `GET /api/v2/analytics/colleges/{college_name}/summary`

- **What this API is about:** College detail summary.
- **Available query parameters:** None.
- **Path parameters:** `college_name`.
- **Response example (200):**
```json
{
  "kpis": [
    {
      "key": "string",
      "label": "string",
      "value": 0,
      "unit": "string"
    }
  ]
}
```

### `GET /api/v2/analytics/colleges/{college_name}/weak-skills`

- **What this API is about:** College weak skills heatmap.
- **Available query parameters:** None.
- **Path parameters:** `college_name`.
- **Response example (200):**
```json
{
  "chartType": "string",
  "items": [
    {
      "x": "string",
      "y": "string",
      "value": 0
    }
  ]
}
```

### `GET /api/v2/analytics/dashboard/active-users-trend`

- **What this API is about:** Active users trend.
- **Available query parameters:**
- `start_date` (query, string, optional)
- `end_date` (query, string, optional)
- `role` (query, string, optional)
- `difficulty` (query, string, optional)
- `college` (query, string, optional)
- **Response example (live sample):**
```json
{
  "chartType": "area",
  "points": [
    {
      "date": "2025-09-29",
      "value": 2
    },
    {
      "date": "2025-09-30",
      "value": 3
    },
    {
      "date": "2025-10-01",
      "value": 3
    },
    "...truncated"
  ]
}
```

### `GET /api/v2/analytics/dashboard/attention-required`

- **What this API is about:** Students needing attention.
- **Available query parameters:**
- `limit` (query, integer, optional) (default: `20`)
- `start_date` (query, string, optional)
- `end_date` (query, string, optional)
- **Response example (live sample):**
```json
{
  "tableType": "attention_required",
  "items": [
    {
      "entity_type": "student",
      "severity": "medium",
      "type": "NO_IMPROVEMENT_AFTER_3_ATTEMPTS",
      "user_id": 5,
      "message": "No improvement after at least 3 interviews."
    },
    {
      "entity_type": "student",
      "severity": "medium",
      "type": "NO_IMPROVEMENT_AFTER_3_ATTEMPTS",
      "user_id": 118,
      "message": "No improvement after at least 3 interviews."
    },
    {
      "entity_type": "student",
      "severity": "medium",
      "type": "TOO_MANY_RETRIES_WITHOUT_PROGRESS",
      "user_id": 118,
      "message": "High reattempt frequency without measurable score improvement."
    },
    "...truncated"
  ],
  "page": 1,
  "limit": 20,
  "total": 37
}
```

### `GET /api/v2/analytics/dashboard/interviews-per-day`

- **What this API is about:** Interviews per day trend.
- **Available query parameters:**
- `start_date` (query, string, optional)
- `end_date` (query, string, optional)
- `role` (query, string, optional)
- `difficulty` (query, string, optional)
- `college` (query, string, optional)
- **Response example (live sample):**
```json
{
  "chartType": "line",
  "points": [
    {
      "date": "2025-09-29",
      "value": 2
    },
    {
      "date": "2025-09-30",
      "value": 5
    },
    {
      "date": "2025-10-01",
      "value": 3
    },
    "...truncated"
  ]
}
```

### `GET /api/v2/analytics/dashboard/overview`

- **What this API is about:** Dashboard overview KPIs.
- **Available query parameters:**
- `start_date` (query, string, optional)
- `end_date` (query, string, optional)
- `role` (query, string, optional)
- `difficulty` (query, string, optional)
- `college` (query, string, optional)
- **Response example (live sample):**
```json
{
  "kpis": [
    {
      "key": "total_students",
      "label": "Total Students",
      "value": 374,
      "unit": null
    },
    {
      "key": "active_users",
      "label": "Active Users",
      "value": 32,
      "unit": null
    },
    {
      "key": "total_interviews",
      "label": "Total Interviews",
      "value": 593,
      "unit": null
    },
    "...truncated"
  ]
}
```

### `GET /api/v2/analytics/dashboard/recent-interviews`

- **What this API is about:** Recent interviews table.
- **Available query parameters:**
- `limit` (query, integer, optional) (default: `10`)
- **Response example (live sample):**
```json
{
  "tableType": "recent_interviews",
  "items": [
    {
      "interview_id": 648,
      "student_name": "Harihar Menon",
      "college": "Government City College",
      "role": "MERN Stack Developer",
      "difficulty": "medium",
      "score": 0,
      "duration_seconds": 0,
      "date": "2026-04-24T06:17:36.408364Z",
      "status": "active"
    },
    {
      "interview_id": 647,
      "student_name": "Asiya Farhath",
      "college": "Government City College",
      "role": "Javascript Developer",
      "difficulty": "easy",
      "score": 0,
      "duration_seconds": 0,
      "date": "2026-04-23T05:51:06.000254Z",
      "status": "active"
    },
    {
      "interview_id": 646,
      "student_name": "Asiya Farhath",
      "college": "Government City College",
      "role": "React Developer",
      "difficulty": "easy",
      "score": 0,
      "duration_seconds": 0,
      "date": "2026-04-23T05:44:15.183882Z",
      "status": "active"
    },
    "...truncated"
  ],
  "page": 1,
  "limit": 10,
  "total": 10
}
```

### `GET /api/v2/analytics/dashboard/recent-students`

- **What this API is about:** Recently active students.
- **Available query parameters:**
- `limit` (query, integer, optional) (default: `10`)
- **Response example (live sample):**
```json
{
  "tableType": "recent_students",
  "items": [
    {
      "student_id": 406,
      "name": "Local Analytics Tester",
      "email": "local_test_analytics@example.com",
      "college": null,
      "target_position": null,
      "created_at": "2026-04-24T16:29:48.678248Z"
    },
    {
      "student_id": 405,
      "name": "Asiya Farhath",
      "email": "farhath.barabari@gmail.com",
      "college": "Government City College",
      "target_position": "React Developer",
      "created_at": "2026-04-22T08:13:58.464807Z"
    },
    {
      "student_id": 404,
      "name": "DesignBuild",
      "email": "designbuild.studio1@gmail.com",
      "college": null,
      "target_position": null,
      "created_at": "2026-04-21T10:44:22.280652Z"
    },
    "...truncated"
  ],
  "page": 1,
  "limit": 10,
  "total": 10
}
```

### `GET /api/v2/analytics/dashboard/score-distribution`

- **What this API is about:** Score distribution histogram.
- **Available query parameters:**
- `start_date` (query, string, optional)
- `end_date` (query, string, optional)
- `role` (query, string, optional)
- `difficulty` (query, string, optional)
- `college` (query, string, optional)
- **Response example (live sample):**
```json
{
  "chartType": "histogram",
  "buckets": [
    {
      "label": "0-0",
      "count": 111
    },
    {
      "label": "0-0",
      "count": 36
    },
    {
      "label": "0-0",
      "count": 35
    },
    "...truncated"
  ]
}
```

### `GET /api/v2/analytics/dashboard/top-colleges`

- **What this API is about:** Top colleges by interview volume.
- **Available query parameters:**
- `limit` (query, integer, optional) (default: `5`)
- `start_date` (query, string, optional)
- `end_date` (query, string, optional)
- `role` (query, string, optional)
- `difficulty` (query, string, optional)
- `college` (query, string, optional)
- **Response example (live sample):**
```json
{
  "tableType": "top_colleges",
  "items": [
    {
      "college": "Test Univ",
      "interviews": 63,
      "avg_score": 66.32,
      "improvement_rate": 11.92,
      "usage_frequency": 63,
      "completion_rate": 0.0
    },
    {
      "college": "unknown",
      "interviews": 84,
      "avg_score": 0,
      "improvement_rate": 0,
      "usage_frequency": 83,
      "completion_rate": 0.0
    },
    {
      "college": "GDC Begumpet",
      "interviews": 240,
      "avg_score": 0,
      "improvement_rate": 0,
      "usage_frequency": 33,
      "completion_rate": 35.0
    },
    "...truncated"
  ]
}
```

### `GET /api/v2/analytics/dashboard/top-roles`

- **What this API is about:** Top roles by interview volume.
- **Available query parameters:**
- `limit` (query, integer, optional) (default: `5`)
- `start_date` (query, string, optional)
- `end_date` (query, string, optional)
- `role` (query, string, optional)
- `difficulty` (query, string, optional)
- `college` (query, string, optional)
- **Response example (live sample):**
```json
{
  "tableType": "top_roles",
  "items": [
    {
      "role": "javascript developer",
      "interviews": 89,
      "avg_score": 66.32,
      "drop_off_rate": 100.0,
      "common_weaknesses": [
        "focus on answering the technical question directly.",
        "directly reference async/await and introduce the topic of error handling.",
        "provide a clear, concise explanation (e.g., using try/catch blocks or handling returned promises).",
        "...truncated"
      ],
      "avg_time_spent_seconds": 3
    },
    {
      "role": "data_science",
      "interviews": 47,
      "avg_score": 0,
      "drop_off_rate": 100.0,
      "common_weaknesses": [],
      "avg_time_spent_seconds": 0
    },
    {
      "role": "JavaScript Developer",
      "interviews": 64,
      "avg_score": 0,
      "drop_off_rate": 43.75,
      "common_weaknesses": [
        "rephrase technical phrases in simpler terms (e.g., instead of 'execution cycle,' say 'in the same round of javascript\u2019s processing').",
        "introduce or define jargon briefly before diving into execution order.",
        "break the question into two smaller questions: (1) how does the event loop handle promises vs. settimeout? (2) which runs first when both happen after execution of synchronous code?",
        "...truncated"
      ],
      "avg_time_spent_seconds": 320466
    },
    "...truncated"
  ]
}
```

### `GET /api/v2/analytics/difficulty/metrics`

- **What this API is about:** Difficulty level metrics.
- **Available query parameters:**
- `start_date` (query, string, optional)
- `end_date` (query, string, optional)
- **Response example (live sample):**
```json
{
  "tableType": "difficulty_metrics",
  "items": [
    {
      "difficulty": "easy",
      "interviews": 239,
      "avg_score": 53.2,
      "completion_rate": 28.87,
      "retry_rate": 30.83
    },
    {
      "difficulty": "medium",
      "interviews": 333,
      "avg_score": 68.46,
      "completion_rate": 28.53,
      "retry_rate": 24.54
    },
    {
      "difficulty": "hard",
      "interviews": 17,
      "avg_score": 0,
      "completion_rate": 35.29,
      "retry_rate": 29.27
    },
    "...truncated"
  ],
  "page": 1,
  "limit": 4,
  "total": 4
}
```

### `GET /api/v2/analytics/dropoffs/funnel`

- **What this API is about:** Drop-off funnel.
- **Available query parameters:**
- `start_date` (query, string, optional)
- `end_date` (query, string, optional)
- **Response example (live sample):**
```json
{
  "chartType": "funnel",
  "stages": [
    {
      "stage": "sign_up",
      "count": 374,
      "rate": 0.0
    },
    {
      "stage": "select_role",
      "count": 26,
      "rate": 6.95
    },
    {
      "stage": "start_interview",
      "count": 26,
      "rate": 100.0
    },
    "...truncated"
  ]
}
```

### `GET /api/v2/analytics/insights/benchmarking`

- **What this API is about:** Benchmarking insights.
- **Available query parameters:** None.
- **Response example (live sample):**
```json
{
  "tableType": "benchmarking",
  "items": [
    {
      "dimension": "role",
      "name": "javascript developer",
      "avg_score": 66.32,
      "platform_avg": 66.32,
      "delta": 0.0
    },
    {
      "dimension": "role",
      "name": "data_science",
      "avg_score": 0,
      "platform_avg": 66.32,
      "delta": 0
    },
    {
      "dimension": "role",
      "name": "JavaScript Developer",
      "avg_score": 0,
      "platform_avg": 66.32,
      "delta": 0
    },
    "...truncated"
  ],
  "page": 1,
  "limit": 19,
  "total": 19
}
```

### `GET /api/v2/analytics/insights/forecasting`

- **What this API is about:** Forecasting trend.
- **Available query parameters:**
- `days_ahead` (query, integer, optional) (default: `7`)
- **Response example (live sample):**
```json
{
  "chartType": "line",
  "points": [
    {
      "date": "2026-04-25",
      "predictedValue": 3.57,
      "lowerBound": 3.03,
      "upperBound": 4.11
    },
    {
      "date": "2026-04-26",
      "predictedValue": 3.57,
      "lowerBound": 3.03,
      "upperBound": 4.11
    },
    {
      "date": "2026-04-27",
      "predictedValue": 3.57,
      "lowerBound": 3.03,
      "upperBound": 4.11
    },
    "...truncated"
  ]
}
```

### `GET /api/v2/analytics/insights/predictive-alerts`

- **What this API is about:** Predictive alerts.
- **Available query parameters:** None.
- **Response example (live sample):**
```json
{
  "tableType": "predictive_alerts",
  "items": [
    {
      "entity_type": "student",
      "prediction": "high_risk_of_dropoff",
      "reason": "No improvement after at least 3 interviews.",
      "confidence": 0.7,
      "type": "NO_IMPROVEMENT_AFTER_3_ATTEMPTS",
      "user_id": 5,
      "message": "No improvement after at least 3 interviews."
    },
    {
      "entity_type": "student",
      "prediction": "high_risk_of_dropoff",
      "reason": "No improvement after at least 3 interviews.",
      "confidence": 0.7,
      "type": "NO_IMPROVEMENT_AFTER_3_ATTEMPTS",
      "user_id": 118,
      "message": "No improvement after at least 3 interviews."
    },
    {
      "entity_type": "student",
      "prediction": "high_risk_of_dropoff",
      "reason": "High reattempt frequency without measurable score improvement.",
      "confidence": 0.7,
      "type": "TOO_MANY_RETRIES_WITHOUT_PROGRESS",
      "user_id": 118,
      "message": "High reattempt frequency without measurable score improvement."
    },
    "...truncated"
  ],
  "page": 1,
  "limit": 37,
  "total": 37
}
```

### `GET /api/v2/analytics/interviews`

- **What this API is about:** List interviews with metrics.
- **Available query parameters:**
- `page` (query, integer, optional) (default: `1`)
- `limit` (query, integer, optional) (default: `20`)
- `role` (query, string, optional)
- `difficulty` (query, string, optional)
- `college` (query, string, optional)
- `start_date` (query, string, optional)
- `end_date` (query, string, optional)
- **Response example (live sample):**
```json
{
  "tableType": "interviews",
  "items": [
    {
      "interview_id": 648,
      "student_name": "Harihar Menon",
      "college": "Government City College",
      "role": "MERN Stack Developer",
      "difficulty": "medium",
      "score": 0,
      "duration": 0,
      "date": "2026-04-24T06:17:36.408364Z"
    },
    {
      "interview_id": 647,
      "student_name": "Asiya Farhath",
      "college": "Government City College",
      "role": "Javascript Developer",
      "difficulty": "easy",
      "score": 0,
      "duration": 0,
      "date": "2026-04-23T05:51:06.000254Z"
    },
    {
      "interview_id": 646,
      "student_name": "Asiya Farhath",
      "college": "Government City College",
      "role": "React Developer",
      "difficulty": "easy",
      "score": 0,
      "duration": 0,
      "date": "2026-04-23T05:44:15.183882Z"
    },
    "...truncated"
  ],
  "page": 1,
  "limit": 20,
  "total": 593
}
```

### `GET /api/v2/analytics/interviews/summary`

- **What this API is about:** Interview analytics summary.
- **Available query parameters:** None.
- **Response example (live sample):**
```json
{
  "kpis": [
    {
      "key": "total_interviews",
      "label": "Total Interviews",
      "value": 593,
      "unit": null
    },
    {
      "key": "average_score",
      "label": "Average Score",
      "value": 66.32,
      "unit": null
    },
    {
      "key": "completion_rate",
      "label": "Completion Rate",
      "value": 29.17,
      "unit": "percent"
    },
    "...truncated"
  ]
}
```

### `GET /api/v2/analytics/interviews/{interview_id}/question-scores`

- **What this API is about:** Interview question score table.
- **Available query parameters:** None.
- **Path parameters:** `interview_id`.
- **Response example (200):**
```json
{
  "tableType": "string",
  "items": [
    {
      "key": {}
    }
  ],
  "page": 0,
  "limit": 0,
  "total": 0
}
```

### `GET /api/v2/analytics/interviews/{interview_id}/question-type-breakdown`

- **What this API is about:** Interview question type breakdown.
- **Available query parameters:** None.
- **Path parameters:** `interview_id`.
- **Response example (200):**
```json
{
  "chartType": "string",
  "buckets": [
    {
      "label": "string",
      "count": 0
    }
  ]
}
```

### `GET /api/v2/analytics/interviews/{interview_id}/speech-metrics-timeline`

- **What this API is about:** Interview speech metrics timeline.
- **Available query parameters:** None.
- **Path parameters:** `interview_id`.
- **Response example (200):**
```json
{
  "chartType": "string",
  "points": [
    {
      "date": "2026-01-01",
      "value": 0
    }
  ]
}
```

### `GET /api/v2/analytics/interviews/{interview_id}/summary`

- **What this API is about:** Interview detail summary.
- **Available query parameters:** None.
- **Path parameters:** `interview_id`.
- **Response example (200):**
```json
{
  "kpis": [
    {
      "key": "string",
      "label": "string",
      "value": 0,
      "unit": "string"
    }
  ]
}
```

### `GET /api/v2/analytics/questions/analytics`

- **What this API is about:** Question level analytics.
- **Available query parameters:**
- `page` (query, integer, optional) (default: `1`)
- `limit` (query, integer, optional) (default: `20`)
- **Response example (live sample):**
```json
{
  "tableType": "question_analytics",
  "items": [
    {
      "question_id": 1,
      "question_text": "When using async/await, how do you handle errors in a way that prevents unhandled promise rejections?",
      "question_type": "tech",
      "attempts": 1,
      "average_score": 57.75
    },
    {
      "question_id": 2,
      "question_text": "If you store data in sessionStorage and then refresh the page in the same browser tab, what happens to the stored data?",
      "question_type": "tech",
      "attempts": 0,
      "average_score": 57.75
    },
    {
      "question_id": 3,
      "question_text": "In a Node.js application that requires sharing functions across multiple files, how do you use CommonJS to export and import those functions?",
      "question_type": "tech",
      "attempts": 0,
      "average_score": 57.75
    },
    "...truncated"
  ],
  "page": 1,
  "limit": 20,
  "total": 2915
}
```

### `GET /api/v2/analytics/rankings/most-improved`

- **What this API is about:** Most improved students.
- **Available query parameters:**
- `page` (query, integer, optional) (default: `1`)
- `limit` (query, integer, optional) (default: `20`)
- **Response example (live sample):**
```json
{
  "tableType": "most_improved",
  "items": [
    {
      "student_id": 406,
      "name": "Local Analytics Tester",
      "college": null,
      "average_score": 0,
      "latest_score": 0,
      "improvement_percent": 0,
      "interviews_count": 0,
      "last_active": null
    },
    {
      "student_id": 405,
      "name": "Asiya Farhath",
      "college": "Government City College",
      "average_score": 0,
      "latest_score": 0,
      "improvement_percent": 0,
      "interviews_count": 5,
      "last_active": "2026-04-23T05:51:06.000254Z"
    },
    {
      "student_id": 404,
      "name": "DesignBuild",
      "college": null,
      "average_score": 0,
      "latest_score": 0,
      "improvement_percent": 0,
      "interviews_count": 0,
      "last_active": null
    },
    "...truncated"
  ],
  "page": 1,
  "limit": 20,
  "total": 374
}
```

### `GET /api/v2/analytics/rankings/struggling`

- **What this API is about:** Struggling students.
- **Available query parameters:**
- `page` (query, integer, optional) (default: `1`)
- `limit` (query, integer, optional) (default: `20`)
- **Response example (live sample):**
```json
{
  "tableType": "struggling_students",
  "items": [
    {
      "student_id": 406,
      "name": "Local Analytics Tester",
      "college": null,
      "average_score": 0,
      "latest_score": 0,
      "improvement_percent": 0,
      "interviews_count": 0,
      "last_active": null
    },
    {
      "student_id": 405,
      "name": "Asiya Farhath",
      "college": "Government City College",
      "average_score": 0,
      "latest_score": 0,
      "improvement_percent": 0,
      "interviews_count": 5,
      "last_active": "2026-04-23T05:51:06.000254Z"
    },
    {
      "student_id": 404,
      "name": "DesignBuild",
      "college": null,
      "average_score": 0,
      "latest_score": 0,
      "improvement_percent": 0,
      "interviews_count": 0,
      "last_active": null
    },
    "...truncated"
  ],
  "page": 1,
  "limit": 20,
  "total": 374
}
```

### `GET /api/v2/analytics/rankings/summary`

- **What this API is about:** Rankings overview KPIs.
- **Available query parameters:** None.
- **Response example (live sample):**
```json
{
  "kpis": [
    {
      "key": "top_performers_count",
      "label": "Number of Top Performers",
      "value": 374,
      "unit": null
    },
    {
      "key": "struggling_students_count",
      "label": "Number of Struggling Students",
      "value": 374,
      "unit": null
    },
    {
      "key": "most_improved_count",
      "label": "Number of Most Improved Students",
      "value": 374,
      "unit": null
    },
    "...truncated"
  ]
}
```

### `GET /api/v2/analytics/rankings/top-performers`

- **What this API is about:** Top performing students.
- **Available query parameters:**
- `page` (query, integer, optional) (default: `1`)
- `limit` (query, integer, optional) (default: `20`)
- **Response example (live sample):**
```json
{
  "tableType": "top_performers",
  "items": [
    {
      "student_id": 30,
      "name": "E2E User",
      "college": "Test Univ",
      "average_score": 80.67,
      "latest_score": 80.67,
      "improvement_percent": 0,
      "interviews_count": 1,
      "last_active": "2025-10-08T15:34:44.541224Z"
    },
    {
      "student_id": 45,
      "name": "E2E User",
      "college": "Test Univ",
      "average_score": 77.33,
      "latest_score": 77.33,
      "improvement_percent": 0,
      "interviews_count": 1,
      "last_active": "2025-10-08T20:25:54.740765Z"
    },
    {
      "student_id": 39,
      "name": "E2E User",
      "college": "Test Univ",
      "average_score": 75.33,
      "latest_score": 75.33,
      "improvement_percent": 0,
      "interviews_count": 1,
      "last_active": "2025-10-08T19:57:35.897384Z"
    },
    "...truncated"
  ],
  "page": 1,
  "limit": 20,
  "total": 374
}
```

### `GET /api/v2/analytics/roles/performance`

- **What this API is about:** Role performance table.
- **Available query parameters:**
- `start_date` (query, string, optional)
- `end_date` (query, string, optional)
- **Response example (live sample):**
```json
{
  "tableType": "role_performance",
  "items": [
    {
      "role": "javascript developer",
      "interviews": 89,
      "avg_score": 66.32,
      "drop_off_rate": 100.0,
      "common_weaknesses": [
        "focus on answering the technical question directly.",
        "directly reference async/await and introduce the topic of error handling.",
        "provide a clear, concise explanation (e.g., using try/catch blocks or handling returned promises).",
        "...truncated"
      ],
      "avg_time_spent_seconds": 3
    },
    {
      "role": "data_science",
      "interviews": 47,
      "avg_score": 0,
      "drop_off_rate": 100.0,
      "common_weaknesses": [],
      "avg_time_spent_seconds": 0
    },
    {
      "role": "JavaScript Developer",
      "interviews": 64,
      "avg_score": 0,
      "drop_off_rate": 43.75,
      "common_weaknesses": [
        "rephrase technical phrases in simpler terms (e.g., instead of 'execution cycle,' say 'in the same round of javascript\u2019s processing').",
        "introduce or define jargon briefly before diving into execution order.",
        "break the question into two smaller questions: (1) how does the event loop handle promises vs. settimeout? (2) which runs first when both happen after execution of synchronous code?",
        "...truncated"
      ],
      "avg_time_spent_seconds": 320466
    },
    "...truncated"
  ],
  "page": 1,
  "limit": 19,
  "total": 19
}
```

### `GET /api/v2/analytics/roles/summary`

- **What this API is about:** Role analytics summary.
- **Available query parameters:** None.
- **Response example (live sample):**
```json
{
  "kpis": [
    {
      "key": "total_roles",
      "label": "Total Roles",
      "value": 19,
      "unit": null
    },
    {
      "key": "most_popular_role",
      "label": "Most Popular Role",
      "value": "React Developer",
      "unit": null
    },
    {
      "key": "highest_avg_role",
      "label": "Highest Average Score Role",
      "value": "javascript developer",
      "unit": null
    },
    "...truncated"
  ]
}
```

### `GET /api/v2/analytics/roles/weak-skills`

- **What this API is about:** Role weak skills heatmap.
- **Available query parameters:**
- `start_date` (query, string, optional)
- `end_date` (query, string, optional)
- **Response example (live sample):**
```json
{
  "chartType": "heatmap",
  "items": [
    {
      "x": "javascript developer",
      "y": "focus on answering the technical question directly.",
      "value": 1
    },
    {
      "x": "javascript developer",
      "y": "directly reference async/await and introduce the topic of error handling.",
      "value": 1
    },
    {
      "x": "javascript developer",
      "y": "provide a clear, concise explanation (e.g., using try/catch blocks or handling returned promises).",
      "value": 1
    },
    "...truncated"
  ]
}
```

### `GET /api/v2/analytics/roles/{role_id}`

- **What this API is about:** Role detail metrics.
- **Available query parameters:** None.
- **Path parameters:** `role_id`.
- **Response example (200):**
```json
{
  "tableType": "string",
  "items": [
    {
      "key": {}
    }
  ]
}
```

### `GET /api/v2/analytics/search`

- **What this API is about:** Global analytics search.
- **Available query parameters:**
- `q` (query, string, required)
- `limit_per_bucket` (query, integer, optional) (default: `5`)
- **Response example (live sample):**
```json
{
  "students": [
    {
      "student_id": 339,
      "name": "Devendra jain",
      "email": "devendraaartijain@gmail.com",
      "college": "GDC Nampally"
    },
    {
      "student_id": 246,
      "name": "Sana Rasheed",
      "email": "sana.barabaricollective@gmail.com",
      "college": "GDC Nampally"
    },
    {
      "student_id": 168,
      "name": "Syeda Saniyya",
      "email": "syeda.saniyya@barabaricollective.org",
      "college": "GDC Nampally"
    },
    "...truncated"
  ],
  "colleges": [
    {
      "college_name": "GDC Nampally",
      "students_count": 5
    }
  ],
  "interviews": []
}
```

### `GET /api/v2/analytics/students`

- **What this API is about:** List students with analytics.
- **Available query parameters:**
- `page` (query, integer, optional) (default: `1`)
- `limit` (query, integer, optional) (default: `20`)
- `q` (query, string, optional)
- `college` (query, string, optional)
- **Response example (live sample):**
```json
{
  "tableType": "students",
  "items": [
    {
      "student_id": 406,
      "name": "Local Analytics Tester",
      "college": null,
      "average_score": 0,
      "latest_score": 0,
      "improvement_percent": 0,
      "interviews_count": 0,
      "last_active": null
    },
    {
      "student_id": 405,
      "name": "Asiya Farhath",
      "college": "Government City College",
      "average_score": 0,
      "latest_score": 0,
      "improvement_percent": 0,
      "interviews_count": 5,
      "last_active": "2026-04-23T05:51:06.000254Z"
    },
    {
      "student_id": 404,
      "name": "DesignBuild",
      "college": null,
      "average_score": 0,
      "latest_score": 0,
      "improvement_percent": 0,
      "interviews_count": 0,
      "last_active": null
    },
    "...truncated"
  ],
  "page": 1,
  "limit": 20,
  "total": 374
}
```

### `GET /api/v2/analytics/students/filters/colleges`

- **What this API is about:** List available college filters.
- **Available query parameters:** None.
- **Response example (live sample):**
```json
{
  "colleges": [
    "Analytics Test College",
    "Anna University",
    "California State University, San Francisco",
    "...truncated"
  ]
}
```

### `GET /api/v2/analytics/students/search`

- **What this API is about:** Search students by name.
- **Available query parameters:**
- `q` (query, string, required)
- `page` (query, integer, optional) (default: `1`)
- `limit` (query, integer, optional) (default: `20`)
- `college` (query, string, optional)
- **Response example (live sample):**
```json
{
  "tableType": "students",
  "items": [
    {
      "student_id": 339,
      "name": "Devendra jain",
      "college": "GDC Nampally",
      "average_score": 0,
      "latest_score": 0,
      "improvement_percent": 0,
      "interviews_count": 6,
      "last_active": "2026-03-20T10:32:29.356828Z"
    },
    {
      "student_id": 246,
      "name": "Sana Rasheed",
      "college": "GDC Nampally",
      "average_score": 0,
      "latest_score": 0,
      "improvement_percent": 0,
      "interviews_count": 2,
      "last_active": "2026-03-05T18:44:57.717845Z"
    },
    {
      "student_id": 168,
      "name": "Syeda Saniyya",
      "college": "GDC Nampally",
      "average_score": 0,
      "latest_score": 0,
      "improvement_percent": 0,
      "interviews_count": 48,
      "last_active": "2026-04-10T11:46:34.555843Z"
    },
    "...truncated"
  ],
  "page": 1,
  "limit": 20,
  "total": 5
}
```

### `GET /api/v2/analytics/students/summary`

- **What this API is about:** Student analytics summary.
- **Available query parameters:** None.
- **Response example (live sample):**
```json
{
  "kpis": [
    {
      "key": "total_students",
      "label": "Total Students",
      "value": 374,
      "unit": null
    },
    {
      "key": "active_students_last_30_days",
      "label": "Active Students (Last 30 Days)",
      "value": 32,
      "unit": null
    },
    {
      "key": "average_score",
      "label": "Average Score",
      "value": 66.32,
      "unit": null
    },
    "...truncated"
  ]
}
```

### `GET /api/v2/analytics/students/{student_id}/interviews`

- **What this API is about:** Student interview history.
- **Available query parameters:**
- `page` (query, integer, optional) (default: `1`)
- `limit` (query, integer, optional) (default: `20`)
- **Path parameters:** `student_id`.
- **Response example (200):**
```json
{
  "tableType": "string",
  "items": [
    {
      "key": {}
    }
  ],
  "page": 0,
  "limit": 0,
  "total": 0
}
```

### `GET /api/v2/analytics/students/{student_id}/latest-feedback`

- **What this API is about:** Latest student feedback.
- **Available query parameters:** None.
- **Path parameters:** `student_id`.
- **Response example (200):**
```json
{
  "studentId": 0,
  "latestFeedback": "string",
  "questionAttemptId": 0,
  "interviewId": 0,
  "createdAt": "2026-01-01T00:00:00Z"
}
```

### `GET /api/v2/analytics/students/{student_id}/practice-completion`

- **What this API is about:** Student practice completion metrics.
- **Available query parameters:**
- `start_date` (query, string, optional)
- `end_date` (query, string, optional)
- **Path parameters:** `student_id`.
- **Response example (200):**
```json
{
  "studentId": 0,
  "kpis": [
    {
      "key": "string",
      "label": "string",
      "value": 0,
      "unit": "string"
    }
  ]
}
```

### `GET /api/v2/analytics/students/{student_id}/profile`

- **What this API is about:** Student profile details.
- **Available query parameters:** None.
- **Path parameters:** `student_id`.
- **Response example (200):**
```json
{
  "studentId": 0,
  "name": "string",
  "email": "string",
  "college": "string",
  "degree": "string",
  "targetPosition": "string",
  "yearsExperience": 0,
  "company": "string",
  "createdAt": "2026-01-01T00:00:00Z",
  "lastActive": "2026-01-01T00:00:00Z"
}
```

### `GET /api/v2/analytics/students/{student_id}/score-history`

- **What this API is about:** Student score history.
- **Available query parameters:**
- `start_date` (query, string, optional)
- `end_date` (query, string, optional)
- **Path parameters:** `student_id`.
- **Response example (200):**
```json
{
  "studentId": 0,
  "chartType": "string",
  "points": [
    {
      "key": {}
    }
  ]
}
```

### `GET /api/v2/analytics/students/{student_id}/skill-averages`

- **What this API is about:** Student skill averages.
- **Available query parameters:**
- `start_date` (query, string, optional)
- `end_date` (query, string, optional)
- **Path parameters:** `student_id`.
- **Response example (200):**
```json
{
  "studentId": 0,
  "chartType": "string",
  "items": [
    {
      "key": {}
    }
  ]
}
```

### `GET /api/v2/analytics/students/{student_id}/speech-vs-knowledge-history`

- **What this API is about:** Speech vs knowledge trend.
- **Available query parameters:**
- `start_date` (query, string, optional)
- `end_date` (query, string, optional)
- **Path parameters:** `student_id`.
- **Response example (200):**
```json
{
  "studentId": 0,
  "chartType": "string",
  "points": [
    {
      "key": {}
    }
  ]
}
```

### `GET /api/v2/analytics/students/{student_id}/summary`

- **What this API is about:** Student KPI summary.
- **Available query parameters:**
- `start_date` (query, string, optional)
- `end_date` (query, string, optional)
- **Path parameters:** `student_id`.
- **Response example (200):**
```json
{
  "studentId": 0,
  "kpis": [
    {
      "key": "string",
      "label": "string",
      "value": 0,
      "unit": "string"
    }
  ]
}
```
