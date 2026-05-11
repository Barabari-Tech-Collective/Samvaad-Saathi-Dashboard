"use client"

import * as React from "react"
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
import { Skeleton } from "@/components/ui/skeleton"
import { useJobProfilesList, useDeleteJobProfile } from "@/lib/api/hooks/analytics/useJobProfiles"
import type { JobProfileItem } from "@/lib/api/hooks/analytics/types"

// ─── Loading skeleton ─────────────────────────────────────────────────────────
function JobProfileSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-4 w-32 mt-1" />
      </CardHeader>
      <CardContent className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="flex gap-2 flex-wrap mt-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-14 rounded-full" />
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Single profile card ──────────────────────────────────────────────────────
function JobProfileCard({ profile }: { profile: JobProfileItem }) {
  const { deleteJobProfileAsync, isDeletingJobProfile } = useDeleteJobProfile()
  const [confirmOpen, setConfirmOpen] = React.useState(false)

  async function handleDelete() {
    try {
      await deleteJobProfileAsync({ id: profile.jobProfileId })
      toast.success(`"${profile.jobName}" deleted successfully`)
      setConfirmOpen(false)
    } catch {
      toast.error("Failed to delete role. Please try again.")
    }
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <IconBriefcase className="size-4 shrink-0 text-muted-foreground" />
            <CardTitle className="text-sm font-semibold leading-tight truncate">
              {profile.jobName}
            </CardTitle>
          </div>

          {/* Delete button */}
          <Button
            variant="ghost"
            size="icon"
            className="size-7 shrink-0 text-muted-foreground hover:text-destructive"
            disabled={isDeletingJobProfile}
            onClick={() => setConfirmOpen(true)}
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
          {profile.jobDescription}
        </p>

        {/* Skills */}
        {profile.skills && profile.skills.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-auto pt-2">
            {profile.skills.slice(0, 6).map((skill) => (
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
            <DialogTitle>Delete &quot;{profile.jobName}&quot;?</DialogTitle>
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

// ─── Main exported component ──────────────────────────────────────────────────
export function JobProfilesList() {
  const { jobProfiles, isLoadingJobProfiles } = useJobProfilesList()

  return (
    <div className="px-4 lg:px-6 space-y-4">
      {/* Section header */}
      <div>
        <h2 className="text-base font-semibold">Job Profiles</h2>
        <p className="text-sm text-muted-foreground">
          Shared profiles used to generate tailored interview questions.
        </p>
      </div>

      {/* Loading state */}
      {isLoadingJobProfiles && (
        <div className="flex flex-col items-center justify-center py-12">
          <IconLoader2 className="size-8 animate-spin text-primary/40" />
          <p className="text-sm text-muted-foreground mt-2 font-medium">Loading job profiles...</p>
        </div>
      )}

      {/* Empty state */}
      {!isLoadingJobProfiles && jobProfiles.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
          <IconBriefcase className="size-10 text-muted-foreground/40 mb-3" />
          <p className="text-sm font-medium text-muted-foreground">No job profiles yet</p>
          <p className="text-xs text-muted-foreground mt-1">
            Use the &quot;Add Role&quot; button above to create your first role.
          </p>
        </div>
      )}

      {/* Profiles grid */}
      {!isLoadingJobProfiles && jobProfiles.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {jobProfiles.map((profile) => (
            <JobProfileCard key={profile.jobProfileId} profile={profile} />
          ))}
        </div>
      )}
    </div>
  )
}
