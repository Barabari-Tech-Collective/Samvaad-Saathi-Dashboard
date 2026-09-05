"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  IconBriefcase,
  IconBuilding,
  IconLoader2,
  IconTrash,
} from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useDeleteJobProfile } from "@/lib/api/hooks/analytics/useJobProfiles"
import type { JobProfileItem } from "@/lib/api/hooks/analytics/types"

export function JobProfileCard({ profile }: { profile: any }) {
  const router = useRouter()
  const { deleteJobProfileAsync, isDeletingJobProfile } = useDeleteJobProfile()
  const [confirmOpen, setConfirmOpen] = React.useState(false)

  const id = profile.jobProfileId || profile.id
  const name = profile.jobName || profile.title
  const description = profile.jobDescription || profile.description

  async function handleDelete() {
    try {
      await deleteJobProfileAsync({ id })
      toast.success(`"${name}" deleted successfully`)
      setConfirmOpen(false)
    } catch {
      toast.error("Failed to delete role. Please try again.")
    }
  }

  function handleCardClick() {
    if (typeof window !== "undefined") {
      const savedStep = localStorage.getItem(`samvaad_saathi_draft_step_${id}`);
      const targetStep = savedStep ? savedStep : "5";
      
      const previousProfileId = localStorage.getItem("samvaad_saathi_draft_profile_id");
      let existingDraft = {}
      if (previousProfileId === id.toString()) {
        const savedDraft = localStorage.getItem("samvaad_saathi_draft_role");
        if (savedDraft) {
          try { existingDraft = JSON.parse(savedDraft) } catch (e) {}
        }
      }

      localStorage.setItem("samvaad_saathi_draft_profile_id", id.toString())

      const formDraft = {
        jdType: "role",
        jobName: profile.jobName || (existingDraft as any).jobName || "",
        companyName: profile.companyName || (existingDraft as any).companyName || "",
        category: profile.category || (existingDraft as any).category || "",
        experienceLevel: profile.experienceLevel || (existingDraft as any).experienceLevel || "",
        employmentType: profile.employmentType || (existingDraft as any).employmentType || "",
        jobDescription: profile.jobDescription || (existingDraft as any).jobDescription || "",
        skills: (profile.skills?.length ? profile.skills : (existingDraft as any).skills) || [],
      };
      localStorage.setItem("samvaad_saathi_draft_role", JSON.stringify(formDraft));
      
      if (targetStep === "4") {
        router.push("/dashboard/roles/new/questions")
      } else {
        router.push(`/dashboard/roles/new?step=${targetStep}`)
      }
    }
  }

  return (
    <Card className="flex flex-col cursor-pointer transition-all hover:bg-slate-50/50 hover:shadow-md" onClick={handleCardClick}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <IconBriefcase className="size-4 shrink-0 text-muted-foreground" />
            <CardTitle className="text-sm font-semibold leading-tight truncate">
              {name}
            </CardTitle>
          </div>

          {/* Delete button */}
          <Button
            variant="ghost"
            size="icon"
            className="size-7 shrink-0 text-muted-foreground hover:text-destructive"
            disabled={isDeletingJobProfile}
            onClick={(e) => {
              e.stopPropagation()
              setConfirmOpen(true)
            }}
          >
            {isDeletingJobProfile ? (
              <IconLoader2 className="size-3.5 animate-spin" />
            ) : (
              <IconTrash className="size-3.5" />
            )}
          </Button>
        </div>

        {profile.companyName && (
          <CardDescription className="flex items-center gap-1 mt-0.5">
            <IconBuilding className="size-3" />
            {profile.companyName}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="flex flex-col gap-3 flex-1">
        {/* Experience level badge */}
        {profile.experienceLevel && (
          <Badge variant="secondary" className="w-fit capitalize">
            {profile.experienceLevel}
          </Badge>
        )}

        {/* Job description preview */}
        <p className="text-sm text-muted-foreground line-clamp-2">
          {description}
        </p>

        {/* Skills */}
        {profile.skills && profile.skills.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-auto pt-2">
            {profile.skills.slice(0, 6).map((skill: string) => (
              <Badge key={skill} variant="outline" className="text-xs">
                {skill}
              </Badge>
            ))}
            {profile.skills.length > 6 && (
              <Badge variant="outline" className="text-xs text-muted-foreground">
                +{profile.skills.length - 6} more
              </Badge>
            )}
          </div>
        )}
      </CardContent>

      {/* Delete confirmation dialog */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete &quot;{name}&quot;?</DialogTitle>
            <DialogDescription>
              This will permanently delete this job profile. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeletingJobProfile}
            >
              {isDeletingJobProfile && <IconLoader2 className="size-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
