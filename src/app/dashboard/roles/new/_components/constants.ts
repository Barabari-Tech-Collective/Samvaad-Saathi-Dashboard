import { z } from "zod"
import {
  IconBriefcase,
  IconCheck,
  IconFileText,
  IconListDetails,
  IconSettings,
  IconSparkles,
} from "@tabler/icons-react"

export const addRoleSchema = z.object({
  jdType: z.enum(["company", "role"], {
    message: "Please select a JD type",
  }),
  jobName: z.string().min(2, "Role name must be at least 2 characters"),
  companyName: z.string().optional(),
  category: z.string().min(1, "Please select a category"),
  experienceLevel: z.string().min(1, "Please select an experience level"),
  employmentType: z.string().min(1, "Please select an employment type"),
  jobDescription: z.string().min(10, "Description must be at least 10 characters"),
  skills: z.array(z.string().min(1)).min(1, "Add at least one skill"),
  additionalContext: z.string().optional(),
})

export type AddRoleFormValues = z.infer<typeof addRoleSchema>

export const STEPS = [
  { label: "Interview Type", icon: IconSettings },
  { label: "Role Details", icon: IconBriefcase },
  { label: "JD & Configuration", icon: IconListDetails },
  { label: "Reference Questions Preview", icon: IconFileText },
  { label: "Questions", icon: IconSparkles },
  { label: "Review & Submit", icon: IconCheck },
]

export const STEP_FIELDS: Array<Array<keyof AddRoleFormValues>> = [
  ["jdType"],
  ["jobName", "companyName", "category", "experienceLevel", "employmentType"],
  ["jobDescription", "skills"],
  [], // Reference Questions Preview
  [], // Questions
  [], // Review & Submit
]

export const CATEGORY_OPTIONS = [
  { value: "all", label: "All Categories" },
  { value: "it", label: "IT" },
  { value: "design", label: "Design" },
  { value: "sales", label: "Sales" },
  { value: "marketing", label: "Marketing" },
  { value: "hr", label: "HR" },
  { value: "operations", label: "Operations" },
  { value: "data", label: "Data" },
]

export const EXPERIENCE_OPTIONS = [
  { value: "1-2", label: "1–2 Years" },
  { value: "2-3", label: "2–3 Years" },
  { value: "3-4", label: "3–4 Years" },
  { value: "4-5", label: "4–5 Years" },
  { value: "5+", label: "5+ Years" },
]

export const EMPLOYMENT_OPTIONS = [
  { value: "full-time", label: "Full-time" },
  { value: "part-time", label: "Part-time" },
  { value: "contract", label: "Contract" },
  { value: "internship", label: "Internship" },
  { value: "freelance", label: "Freelance" },
]

export const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "60%" : "-60%",
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction > 0 ? "-60%" : "60%",
    opacity: 0,
  }),
}

export interface DifficultyLevel {
  level: number
  selected: boolean
  badge: string
  badgeLabel: string
  title: string
  description: string
  exampleQuestion: string
  placeholder: string
  count: number
}
