# Product Requirements Document (PRD)

## Internal Analytics Dashboard

Platform: Next.js  
Users: Founder / Admin Team  
Purpose: Monitor student progress, interview outcomes, college performance, operational trends, and drill down into entities like students, colleges, roles, and interviews.

# 1. Product Scope

Build a responsive internal dashboard with:

- Executive metrics
- Student analytics
- College analytics
- Interview analytics
- Role analytics
- Drilldown pages
- Search + filters
- Recent activity

# 2. Navigation Structure

```text
Sidebar
├── Dashboard
├── Students
└── Interviews
```

# 4. DASHBOARD MODULE

## Dashboard Overview Page

### KPI Cards

- Total Students
- Active Users
- Total Interviews
- Average Score
- Improvement %
- Completion Rate

### APIs Required

- API for fetching platform summary metrics
- API for fetching active users count in selected date range
- API for fetching completion metrics
- API for fetching improvement metrics

### Widgets

- Interviews per day (line chart)
- Active users trend (area chart)
- Top roles used
- Top colleges snapshot
- Score distribution
- Recent interviews
- Recently added students
- Attention required

### APIs Required

- API for fetching interview counts grouped by date
- API for fetching active users trend
- API for fetching role usage metrics
- API for fetching top colleges summary
- API for fetching score distribution
- API for fetching recent interviews list
- API for fetching recently registered students
- API for fetching flagged students / alerts

# 5. STUDENTS MODULE

## Sub Navigation

```text
Students
├── All Students
├── Colleges
├── Top Performers
├── Struggling
├── Most Improved
├── Student Detail
└── College Detail
```

## All Students

### Summary Stats Cards (Baseball Cards)

- Total Students
- Active Students (Last 30 Days)
- Average Score
- Total Interviews
- Overall Improvement %
- Completion Rate

### Table Columns

- Student ID
- Name
- College
- Average Score
- Latest Score
- Improvement %
- Interviews Count
- Last Active

### APIs Required

- API for fetching paginated students list with filters
- API for searching students
- API for fetching colleges for filter dropdown

## Student Detail

### Sections

- Basic profile
- Stats Cards (Baseball Cards)
  - Total Interviews
  - Average Score
  - Improvement %
  - Last Active Date
  - Practice Completion Rate
  - Speech Score
  - Knowledge Score
- Progress graph
- Speech vs knowledge graph
- Weak area radar
- Practice completion
- Interview history
- Latest AI feedback

### APIs Required

- API for fetching student profile by student id
- API for fetching student summary metrics
- API for fetching student score history
- API for fetching speech vs knowledge history
- API for fetching student skill averages
- API for fetching practice completion by student id
- API for fetching interviews by student id
- API for fetching latest feedback by student id

## Colleges

### Summary Stats Cards (Baseball Cards)

- Total Colleges
- Total Students
- Total Interviews
- Average Score
- Highest Performing College
- Lowest Performing College

### Table Columns

- College Name
- Students Count
- Interviews Count
- Avg Score
- Improvement %
- Active Users

### APIs Required

- API for fetching colleges summary list

## College Detail

### Sections

- Stats Cards (Baseball Cards)
  - Total Students Enrolled
  - Students Who Have Given Interviews
  - Average Score
  - Improvement %
  - Active Users (Last 30 Days)
  - Completion Rate
- Student growth trend
- Avg score trend
- Practice engagement
- Weak areas heatmap
- Students list

### APIs Required

- API for fetching college summary by college id
- API for fetching student count growth by college id
- API for fetching score trend by college id
- API for fetching practice metrics by college id
- API for fetching weak skills by college id
- API for fetching students by college id

## Rankings

### Summary Stats Cards (Baseball Cards)

- Number of Top Performers
- Number of Struggling Students
- Number of Most Improved Students
- Average Score of Top Performers
- Average Score of Struggling Students
- Average Improvement of Most Improved Students

- Top performers
- Struggling students
- Most improved students

### APIs Required

- API for fetching top students
- API for fetching struggling students
- API for fetching most improved students

# 6. INTERVIEWS MODULE

## Sub Navigation

```text
Interviews
├── All Interviews
├── Roles
├── Difficulty
├── Questions
├── Drop-offs
└── Interview Detail
```

## All Interviews

### Summary Stats Cards (Baseball Cards)

- Total Interviews
- Average Score
- Completion Rate
- Average Duration
- Most Popular Role
- Most Popular Difficulty

### Table Columns

- Interview ID
- Student Name
- College
- Role
- Difficulty
- Score
- Duration
- Date

### APIs Required

- API for fetching paginated interviews list with filters

## Interview Detail

### Sections

- Stats Cards (Baseball Cards)
  - Overall Score
  - Duration
  - Difficulty Level
  - Number of Questions
  - Speech Score
  - Knowledge Score
  - Completion Status
- Question-wise scores
- Speech metrics timeline
- Question type split

### APIs Required

- API for fetching interview summary by interview id
- API for fetching question scores by interview id
- API for fetching speech metrics timeline by interview id
- API for fetching question type breakdown by interview id

## Roles

### Summary Stats Cards (Baseball Cards)

- Total Roles
- Most Popular Role
- Highest Average Score Role
- Lowest Average Score Role
- Total Interviews Across Roles
- Overall Completion Rate

### Sections

- Avg score by role
- Interviews by role
- Completion rate
- Weakness heatmap
- Role detail

### APIs Required

- API for fetching role performance summary
- API for fetching weak skill metrics grouped by role
- API for fetching role details by role id

## Difficulty

### Summary Stats Cards (Baseball Cards)

- Number of Easy Interviews
- Number of Medium Interviews
- Number of Hard Interviews
- Average Score for Easy
- Average Score for Medium
- Average Score for Hard

- Easy vs Medium vs Hard comparison

### APIs Required

- API for fetching metrics grouped by difficulty

## Questions

### Summary Stats Cards (Baseball Cards)

- Total Questions
- Average Score Across Questions
- Highest Scoring Question
- Lowest Scoring Question
- Most Dropped Question
- Average Response Time

- Lowest scoring questions
- Highest drop-off questions
- Follow-up trigger rate
- Avg response time

### APIs Required

- API for fetching aggregated question analytics

## Drop-offs

### Summary Stats Cards (Baseball Cards)

- Total Started Interviews
- Completion Rate
- Drop-off at Question 1
- Drop-off at Question 2
- Drop-off at Question 3
- Average Completion Stage

- Funnel from start to completion

### APIs Required

- API for fetching interview stage drop-off funnel data

# 7. Search & Drilldown

### APIs Required

- API for global search across students, colleges, interviews

# 8. Frontend Stack

- Next.js
- Tailwind CSS
- shadcn/ui
- Apache ECharts

# 9. Build Priority

## Phase 1

- Dashboard
- All Students
- Student Detail
- All Interviews
- College List

## Phase 2

- College Detail
- Role analytics
- Difficulty analytics
- Questions analytics

## Phase 3

- Predictive alerts
- Benchmarking
- Forecasting
