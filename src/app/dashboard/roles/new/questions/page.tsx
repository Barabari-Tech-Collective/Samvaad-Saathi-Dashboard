"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  IconSearch,
  IconPlus,
  IconPencil,
  IconRefresh,
  IconTrash,
  IconCheck,
  IconX,
  IconSparkles,
  IconChevronLeft,
  IconBriefcase,
  IconAlertCircle,
  IconFileText,
  IconFolder,
  IconKey,
  IconBulb,
  IconChevronUp,
  IconChevronDown,
} from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { StepIndicator } from "../_components/add-role-stepper"

// 50 highly realistic Front-End questions distributed across 4 difficulty levels
const INITIAL_QUESTIONS = [
  // LEVEL 1 (15 questions)
  ...Array.from({ length: 15 }, (_, i) => ({
    id: `q-1-${i}`,
    level: 1,
    category: "THEORETICAL",
    difficulty: "EASY",
    text: [
      "Explain the difference between var, let, and const in JavaScript.",
      "What is the box model in CSS?",
      "What are React hooks and why were they introduced?",
      "Explain the concept of semantic HTML.",
      "What is the difference between double equals (==) and triple equals (===) in JavaScript?",
      "What are the different ways to style a React application?",
      "What is the purpose of the alt attribute on an image tag?",
      "Explain what 'use strict' does in JavaScript.",
      "What is a closure in JavaScript?",
      "What are media queries and how are they used in CSS?",
      "What is the Virtual DOM in React?",
      "Explain the difference between state and props in React.",
      "What is event bubbling in the browser DOM?",
      "What are the primitive data types in JavaScript?",
      "What is the purpose of the key prop in React lists?"
    ][i % 15],
    isAiGenerated: true
  })),
  // LEVEL 2 (15 questions)
  ...Array.from({ length: 15 }, (_, i) => ({
    id: `q-2-${i}`,
    level: 2,
    category: "THEORETICAL",
    difficulty: "MEDIUM",
    text: [
      "How does the browser event loop work?",
      "Describe how the HTTP request lifecycle works.",
      "What is the difference between server-side rendering (SSR) and static site generation (SSG)?",
      "Explain how closures can lead to memory leaks in JavaScript.",
      "What is the difference between LocalStorage, SessionStorage, and Cookies?",
      "Explain the dependency array in React's useEffect hook.",
      "What are higher-order components (HOCs) in React?",
      "How does CORS (Cross-Origin Resource Sharing) work?",
      "What is the difference between debounce and throttle?",
      "Explain how flexbox and grid layouts differ in CSS.",
      "What is the purpose of React.memo() and when should you use it?",
      "How does promise chaining work in JavaScript?",
      "What are the benefits of using TypeScript over vanilla JavaScript?",
      "Explain the difference between client-side routing and server-side routing.",
      "What is CSS specificity and how is it calculated?"
    ][i % 15],
    isAiGenerated: true
  })),
  // LEVEL 3 (10 questions)
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `q-3-${i}`,
    level: 3,
    category: "PRACTICAL",
    difficulty: "MEDIUM",
    text: [
      "How would you optimize a slow loading REACT component?",
      "Write a custom hook in React to fetch data from an API with caching.",
      "Explain how to implement code-splitting in a Next.js application.",
      "How would you handle global state management in a large-scale React application?",
      "Write a JavaScript function to perform a deep clone of an object.",
      "Describe how you would implement infinite scrolling in a list component.",
      "How do you profile performance bottlenecks in Chrome DevTools?",
      "Explain how you would handle error boundaries in React.",
      "Write a responsive CSS layout using CSS Grid without media queries.",
      "How would you implement a secure JWT authentication flow in Next.js?"
    ][i % 10],
    isAiGenerated: true
  })),
  // LEVEL 4 (10 questions)
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `q-4-${i}`,
    level: 4,
    category: "PRACTICAL",
    difficulty: "HARD",
    text: [
      "How would you design a highly scalable micro-frontend architecture?",
      "Explain how you would optimize Core Web Vitals (LCP, FID, CLS) for an e-commerce site.",
      "Write a complex state machine using XState or pure React to manage a multi-step checkout flow.",
      "How would you prevent re-renders in a highly dynamic real-time dashboard component?",
      "Describe how you would design and build a custom component library with full accessibility (WAI-ARIA).",
      "How do you implement offline support and service workers in a Progressive Web App (PWA)?",
      "Write a Webpack configuration from scratch that supports TypeScript, CSS modules, and code splitting.",
      "Explain the security implications of XSS and CSRF in Next.js and how to mitigate them.",
      "How do you orchestrate Web Workers to run heavy algorithms off the main UI thread?",
      "Describe how you would migrate a legacy monolithic single-page app to Next.js incremental static regeneration."
    ][i % 10],
    isAiGenerated: true
  }))
]

export default function QuestionsConfigurationPage() {
  const router = useRouter()

  // Expanded question state (only one expanded at a time)
  const [expandedQuestionId, setExpandedQuestionId] = React.useState<string | null>(null)

  // Details dictionary helper for rich details expanded card
  const getQuestionDetails = (qText: string) => {
    const text = qText.toLowerCase()
    if (text.includes("var, let, and const")) {
      return {
        keywords: ["var", "let", "const", "hoisting", "scope", "block scope"],
        concepts: ["Variable declaration", "Hoisting behavior", "Scope (Function vs Block)", "Re-declaration rules", "Temporal Dead Zone"],
        expectedAnswer: "Step-by-step explanation covering difference, scope, hoisting and usage scenarios.",
        exampleOutput: "Explains each keyword with examples and when to use which."
      }
    }
    if (text.includes("react hooks")) {
      return {
        keywords: ["hooks", "functional components", "state", "lifecycle", "useState", "useEffect"],
        concepts: ["Stateful logic sharing", "Class component drawbacks", "Functional programming", "Side effects management", "Rules of Hooks"],
        expectedAnswer: "React Hooks let functional components use state and lifecycle methods without classes, reducing boilerplate and encouraging reusability.",
        exampleOutput: "Shows examples of useState, useEffect, and custom hooks compared to traditional class lifecycle methods."
      }
    }
    if (text.includes("event loop")) {
      return {
        keywords: ["event loop", "call stack", "callback queue", "microtasks", "macrotasks", "asynchronous"],
        concepts: ["Single-threaded execution", "Execution stack execution", "Task queue prioritization", "Promise/Microtask scheduling", "Browser rendering cycles"],
        expectedAnswer: "The Event Loop orchestrates asynchronous JS by monitoring the call stack and pushing callbacks from task queues when the stack is empty.",
        exampleOutput: "Visualizes code execution order with console.logs of Promises, setTimeouts, and synchronous code."
      }
    }
    if (text.includes("box model")) {
      return {
        keywords: ["box model", "content", "padding", "border", "margin", "box-sizing"],
        concepts: ["Content area dimensions", "Padding interior spacing", "Border separation outline", "Margin exterior spacing", "Content-box vs Border-box sizing"],
        expectedAnswer: "The CSS box model is a container that wraps HTML elements, consisting of margins, borders, padding, and the actual content.",
        exampleOutput: "Demonstrates width calculation differences between content-box and border-box sizing models."
      }
    }
    if (text.includes("http request lifecycle")) {
      return {
        keywords: ["http", "dns lookup", "tcp handshake", "ssl tls", "http parser", "response"],
        concepts: ["DNS resolution routing", "TCP connection handshake", "TLS secure negotiation", "HTTP server request handling", "Browser DOM construction"],
        expectedAnswer: "Explains the journey of a request from browser DNS lookup to server processing, down to receiving the HTTP response packet.",
        exampleOutput: "Lists each micro-step of standard network handshakes and payload delivery stages."
      }
    }
    return {
      keywords: ["frontend", "best practices", "performance", "architecture", "optimization"],
      concepts: ["Core concepts", "Performance optimizations", "Cross-browser compatibility", "Maintainable architecture", "Modern specifications"],
      expectedAnswer: "A complete explanation addressing the core design, performance implications, and practical implementation details of the topic.",
      exampleOutput: "Code example illustrating the pattern in production, along with edge case handling and optimization tips."
    }
  }

  // Load difficulty levels from localStorage or fallback to default
  const [difficultyLevels, setDifficultyLevels] = React.useState([
    { level: 1, selected: true, count: 15, badgeLabel: "Foundational", title: "General Fundamentals" },
    { level: 2, selected: true, count: 15, badgeLabel: "Intermediate", title: "Project & Resume Based" },
    { level: 3, selected: true, count: 10, badgeLabel: "Advanced", title: "Production & Scenario Based" },
    { level: 4, selected: true, count: 10, badgeLabel: "Expert", title: "Advanced / Pressure Scenarios" }
  ])

  // Local state for full list of questions
  const [questions, setQuestions] = React.useState<any[]>([])
  const [activeTab, setActiveTab] = React.useState<number>(1)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [draftTitle, setDraftTitle] = React.useState("Senior Front-End Developer - Engineering")

  // Modals state
  const [isAddOpen, setIsAddOpen] = React.useState(false)
  const [isEditOpen, setIsEditOpen] = React.useState(false)
  const [activeQuestion, setActiveQuestion] = React.useState<any>(null)

  // Floating Toast state
  const [showToast, setShowToast] = React.useState(true)

  // Sync effect to load levels and mock simulated Backend Generate Questions API Request
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const savedLevels = localStorage.getItem("samvaad_saathi_difficulty_levels")
      if (savedLevels) {
        try {
          const parsed = JSON.parse(savedLevels)
          if (Array.isArray(parsed) && parsed.length > 0) {
            setDifficultyLevels(parsed)

            // Dynamic question counting sync log for API Parity
            const levelsPayload = parsed.map(l => ({
              level: l.level,
              count: l.selected ? l.count : 0
            }))
            console.log("Simulating Backend Generate Questions API Request payload:", {
              levels: levelsPayload
            })
          }
        } catch (e) {
          console.error("Failed to parse difficulty levels:", e)
        }
      }

      const saved = localStorage.getItem("samvaad_saathi_draft_role")
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          if (parsed.jobName) {
            setDraftTitle(`${parsed.jobName} - ${parsed.companyName || "Engineering"}`)
          }
        } catch (e) {
          console.error(e)
        }
      }
    }
  }, [])

  // Sync questions array counts to match custom selected difficulty levels
  React.useEffect(() => {
    const activeQuestionsList: any[] = []
    difficultyLevels.forEach((level) => {
      if (level.selected) {
        const levelPool = INITIAL_QUESTIONS.filter(q => q.level === level.level)
        const count = level.count
        if (levelPool.length >= count) {
          activeQuestionsList.push(...levelPool.slice(0, count))
        } else {
          activeQuestionsList.push(...levelPool)
          const remaining = count - levelPool.length
          for (let i = 0; i < remaining; i++) {
            activeQuestionsList.push({
              id: `q-extra-${level.level}-${i}-${Date.now()}`,
              level: level.level,
              category: level.level > 2 ? "PRACTICAL" : "THEORETICAL",
              difficulty: level.level === 1 ? "EASY" : level.level === 4 ? "HARD" : "MEDIUM",
              text: `AI generated instruction question for ${level.title} #${i + 1}`,
              isAiGenerated: true
            })
          }
        }
      }
    })
    setQuestions(activeQuestionsList)
  }, [difficultyLevels])

  const activeLevels = difficultyLevels.filter(l => l.selected)
  const totalQuestions = activeLevels.reduce((acc, curr) => acc + curr.count, 0)

  React.useEffect(() => {
    if (activeLevels.length > 0 && !activeLevels.some(l => l.level === activeTab)) {
      setActiveTab(activeLevels[0].level)
    }
  }, [difficultyLevels, activeTab])

  // Set the first question of the current level expanded by default on tab change
  React.useEffect(() => {
    const firstOfLevel = questions.find(q => q.level === activeTab)
    if (firstOfLevel) {
      setExpandedQuestionId(firstOfLevel.id)
    } else {
      setExpandedQuestionId(null)
    }
  }, [activeTab])

  // Modals input fields
  const [modalText, setModalText] = React.useState("")
  const [modalCategory, setModalCategory] = React.useState("THEORETICAL")
  const [modalDifficulty, setModalDifficulty] = React.useState("MEDIUM")

  // Counts of levels
  const countL1 = questions.filter(q => q.level === 1).length
  const countL2 = questions.filter(q => q.level === 2).length
  const countL3 = questions.filter(q => q.level === 3).length
  const countL4 = questions.filter(q => q.level === 4).length

  // Filtered Questions
  const filteredQuestions = questions.filter((q) => {
    const matchesLevel = q.level === activeTab
    const matchesSearch = q.text.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesLevel && matchesSearch
  })

  // Dynamic actions
  const handleDelete = (id: string) => {
    setQuestions(prev => prev.filter(q => q.id !== id))
    toast.success("Question deleted successfully")
  }

  const handleOpenEdit = (q: any) => {
    setActiveQuestion(q)
    setModalText(q.text)
    setModalCategory(q.category)
    setModalDifficulty(q.difficulty)
    setIsEditOpen(true)
  }

  const handleSaveEdit = () => {
    if (!modalText.trim()) return
    setQuestions(prev => prev.map(q => q.id === activeQuestion.id ? {
      ...q,
      text: modalText,
      category: modalCategory,
      difficulty: modalDifficulty
    } : q))
    setIsEditOpen(false)
    toast.success("Question updated successfully")
  }

  const handleOpenAdd = () => {
    setModalText("")
    setModalCategory("THEORETICAL")
    setModalDifficulty("EASY")
    setIsAddOpen(true)
  }

  const handleAddQuestion = () => {
    if (!modalText.trim()) return
    const newQ = {
      id: `q-custom-${Date.now()}`,
      level: activeTab,
      category: modalCategory,
      difficulty: modalDifficulty,
      text: modalText,
      isAiGenerated: false
    }
    setQuestions(prev => [newQ, ...prev])
    setIsAddOpen(false)
    toast.success("New question added successfully")
  }

  const handleRegenerate = (id: string) => {
    const newOptions = [
      "Describe the architecture of a custom React context wrapper.",
      "Explain the trade-offs of micro-frontend builds vs monorepos.",
      "How does the browser parse HTML and CSS to create the Render Tree?",
      "What is the difference between requestAnimationFrame and setTimeout?",
      "How would you implement state preservation across Page reloads in Next.js?",
      "Explain how closures create private scopes in Javascript modules."
    ]
    const randomText = newOptions[Math.floor(Math.random() * newOptions.length)]
    
    setQuestions(prev => prev.map(q => q.id === id ? {
      ...q,
      text: randomText,
      isAiGenerated: true
    } : q))
    toast.success("Question regenerated by AI successfully")
  }

  return (
    <div className="flex flex-col gap-5 py-4 px-4 lg:px-6 relative min-h-[calc(100vh-100px)]">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mb-1 select-none">
            <span>Roles Analytics</span>
            <span>/</span>
            <span className="text-slate-400">New role</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">
            Create a new interview role
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold rounded-lg px-4 py-2 h-9 text-xs transition-colors shadow-sm"
            onClick={() => {
              toast.success("Draft saved successfully")
              router.push("/dashboard/roles")
            }}
          >
            Save draft
          </Button>
          <Button
            variant="ghost"
            className="hover:bg-slate-100 text-slate-600 font-semibold rounded-lg px-4 py-2 h-9 text-xs transition-colors"
            onClick={() => router.push("/dashboard/roles")}
          >
            Cancel
          </Button>
        </div>
      </div>

      {/* Stepper Display (Renders the exact 5-step stepper using the old design) */}
      <div className="border border-slate-200 rounded-2xl p-6 bg-white shadow-sm overflow-hidden select-none">
        <StepIndicator currentStep={3} />
      </div>

      {/* Role Draft Card */}
      <Card className="border border-slate-200 rounded-xl shadow-sm bg-white overflow-hidden">
        <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <IconFileText className="size-6 text-blue-600" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Role draft</span>
                <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-none text-[10px] px-2 py-0">Draft</Badge>
              </div>
              <h2 className="text-base font-extrabold text-slate-800 mt-0.5">
                {draftTitle}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-[#EFF6FF] border border-blue-100 rounded-lg px-3 py-1.5">
            <IconSparkles className="size-4 text-blue-600" />
            <span className="text-xs font-bold text-blue-700">{totalQuestions} questions generated</span>
          </div>
        </CardContent>
      </Card>

      {/* Level Tabs and Filter Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2 border-b border-slate-100 pb-3">
        {/* Level Tabs */}
        <div className="flex flex-wrap gap-2">
          {activeLevels.map((level) => {
            const levelQuestionsCount = questions.filter(q => q.level === level.level).length
            return (
              <button
                key={level.level}
                onClick={() => setActiveTab(level.level)}
                className={cn(
                  "px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer shadow-sm",
                  activeTab === level.level
                    ? "bg-[#2563EB] text-white ring-1 ring-blue-500 font-extrabold"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200"
                )}
              >
                LEVEL {level.level} <span className={cn(
                  "ml-1 text-[10px] px-1.5 py-0.2 rounded-full",
                  activeTab === level.level ? "bg-white/20 text-white" : "bg-slate-200 text-slate-500"
                )}>{levelQuestionsCount}</span>
              </button>
            )
          })}
        </div>

        {/* Right Side Actions / Search */}
        <div className="flex flex-wrap items-center gap-2 md:self-end">
          <div className="relative w-48 sm:w-56">
            <IconSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions..."
              className="w-full bg-white border border-slate-300 rounded-lg pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <IconX className="size-3.5" />
              </button>
            )}
          </div>

          <Button
            variant="outline"
            className="border border-slate-300 hover:bg-slate-50 text-slate-600 text-xs font-semibold px-3 py-1.5 h-8 rounded-lg shadow-sm"
            onClick={() => toast.info(`Preview of all ${totalQuestions} questions is open!`)}
          >
            Preview all
          </Button>

          <Button
            onClick={handleOpenAdd}
            className="bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 h-8 rounded-lg shadow-sm flex items-center gap-1"
          >
            <IconPlus className="size-3.5" /> Add question
          </Button>
        </div>
      </div>

      {/* Dynamic Questions List */}
      <div className="space-y-3">
        {filteredQuestions.length === 0 ? (
          <div className="border border-dashed border-slate-200 rounded-xl p-12 text-center bg-white shadow-sm">
            <IconAlertCircle className="size-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-slate-700">No questions found</h3>
            <p className="text-xs text-slate-400 mt-1">Try modifying your search or add a custom question.</p>
          </div>
        ) : (
          filteredQuestions.map((q, idx) => {
            const isExpanded = expandedQuestionId === q.id
            const details = getQuestionDetails(q.text)

            return (
              <div
                key={q.id}
                className={cn(
                  "border rounded-2xl p-5 bg-white transition-all duration-200 flex flex-col gap-4 shadow-sm",
                  isExpanded ? "border-[#2563EB]/45 ring-1 ring-blue-500/10 shadow-md" : "border-slate-200 hover:border-blue-200 hover:shadow-md"
                )}
              >
                {/* Top Row: Question content and inline actions */}
                <div 
                  className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 w-full cursor-pointer select-none"
                  onClick={(e) => {
                    // Prevent toggle if clicking buttons/actions
                    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('a')) {
                      return
                    }
                    setExpandedQuestionId(prev => prev === q.id ? null : q.id)
                  }}
                >
                  <div className="flex items-start gap-4 flex-1">
                    {/* Circle number */}
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 font-bold text-xs mt-0.5 select-none">
                      {idx + 1}
                    </div>

                    <div className="space-y-1.5 flex-1">
                      {/* Show badges ONLY when COLLAPSED */}
                      {!isExpanded && (
                        <div className="flex flex-wrap items-center gap-1.5">
                          <Badge variant="outline" className="bg-[#EFF6FF] text-[#2563EB] border-blue-100 text-[10px] font-bold px-2.5 py-0.5 select-none rounded-full">
                            {q.category}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-[10px] font-bold px-2.5 py-0.5 select-none rounded-full border-none",
                              q.difficulty === "EASY" && "bg-emerald-50 text-emerald-700",
                              q.difficulty === "MEDIUM" && "bg-amber-50 text-amber-700",
                              q.difficulty === "HARD" && "bg-rose-50 text-rose-700"
                            )}
                          >
                            {q.difficulty}
                          </Badge>
                          {q.isAiGenerated && (
                            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-100 text-[10px] font-bold px-2.5 py-0.5 select-none rounded-full flex items-center gap-1">
                              <IconSparkles className="size-3 text-purple-600" /> AI generated
                            </Badge>
                          )}
                        </div>
                      )}

                      <p className="text-sm font-semibold text-slate-800 leading-relaxed pr-6 select-text">
                        {q.text}
                      </p>
                    </div>
                  </div>

                  {/* Actions on the Right */}
                  <div className="flex items-center gap-4 shrink-0 self-end md:self-auto border-t md:border-t-0 pt-2 md:pt-0 w-full md:w-auto justify-end md:justify-start">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleOpenEdit(q)
                      }}
                      className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors cursor-pointer py-1 px-1.5 rounded hover:bg-slate-50"
                    >
                      <IconPencil className="size-3.5 text-slate-500" />
                      Edit
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRegenerate(q.id)
                      }}
                      className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-purple-600 transition-colors cursor-pointer py-1 px-1.5 rounded hover:bg-slate-50"
                    >
                      <IconRefresh className="size-3.5 text-slate-500" />
                      Regenerate
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(q.id)
                      }}
                      className="inline-flex items-center gap-1 text-xs font-bold text-red-500 hover:text-red-700 transition-colors cursor-pointer py-1 px-1.5 rounded hover:bg-red-50"
                    >
                      <IconTrash className="size-3.5 text-red-500" />
                      Delete
                    </button>

                    {/* Arrow Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setExpandedQuestionId(prev => prev === q.id ? null : q.id)
                      }}
                      className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-50 cursor-pointer transition-colors"
                    >
                      {isExpanded ? (
                        <IconChevronUp className="size-4 text-slate-500" />
                      ) : (
                        <IconChevronDown className="size-4 text-slate-500" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Expanded details card matching Figma perfectly */}
                {isExpanded && (
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
                )}
              </div>
            )
          })
        )}
      </div>

      {/* Floating Bottom-Right Toast */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#EFF6FF] border border-blue-200 rounded-xl px-4 py-3 shadow-lg flex items-center gap-3 animate-in slide-in-from-bottom duration-300">
          <div className="flex size-6 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <IconCheck className="size-4 font-bold" />
          </div>
          <div>
            <p className="text-xs font-extrabold text-blue-800">{totalQuestions} questions generated successfully</p>
          </div>
          <button
            onClick={() => setShowToast(false)}
            className="text-blue-400 hover:text-blue-600 transition-colors ml-2 cursor-pointer"
          >
            <IconX className="size-4" />
          </button>
        </div>
      )}

      {/* Footer Navigation bar */}
      <div className="flex items-center justify-between border-t border-slate-200 pt-4 mt-8">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/dashboard/roles/new?step=2")}
          className="border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold rounded-lg px-6 py-2.5 shadow-sm transition-colors duration-200 h-11 flex items-center gap-1.5"
        >
          <IconChevronLeft className="size-4" />
          Back
        </Button>

        <span className="text-xs font-bold text-slate-400 select-none hidden md:inline">
          Step 4 of 5
        </span>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold rounded-lg px-6 py-2.5 shadow-sm transition-colors duration-200 h-11"
            onClick={() => {
              toast.success("Draft saved successfully")
              router.push("/dashboard/roles")
            }}
          >
            Save draft
          </Button>

          <Button
            className="bg-[#2563EB] hover:bg-blue-700 text-white font-semibold rounded-lg px-6 py-2.5 shadow-sm transition-colors duration-200 h-11 flex items-center gap-1.5"
            onClick={() => {
              toast.success("Role questions successfully reviewed!")
              router.push("/dashboard/roles/new?step=4")
            }}
          >
            Final review
            <IconCheck className="size-4" />
          </Button>
        </div>
      </div>

      {/* Add Question Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <Card className="w-full max-w-md border border-slate-200 rounded-2xl shadow-xl bg-white animate-in zoom-in-95 duration-200">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b">
                <h3 className="font-bold text-slate-800 text-base">Add New Question</h3>
                <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
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
                <Button variant="ghost" onClick={() => setIsAddOpen(false)} className="text-xs h-9">
                  Cancel
                </Button>
                <Button onClick={handleAddQuestion} className="bg-[#2563EB] hover:bg-blue-700 text-white text-xs h-9 font-bold px-4 rounded-lg">
                  Add Question
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Edit Question Modal */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <Card className="w-full max-w-md border border-slate-200 rounded-2xl shadow-xl bg-white animate-in zoom-in-95 duration-200">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b">
                <h3 className="font-bold text-slate-800 text-base">Edit Question</h3>
                <button onClick={() => setIsEditOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                  <IconX className="size-4" />
                </button>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600">Question Text</label>
                <Textarea
                  value={modalText}
                  onChange={(e) => setModalText(e.target.value)}
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
                <Button variant="ghost" onClick={() => setIsEditOpen(false)} className="text-xs h-9">
                  Cancel
                </Button>
                <Button onClick={handleSaveEdit} className="bg-[#2563EB] hover:bg-blue-700 text-white text-xs h-9 font-bold px-4 rounded-lg">
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
