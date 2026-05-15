"use client"

import * as React from "react"
import {
  IconBriefcase,
  IconLoader2,
} from "@tabler/icons-react"

import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useJobProfilesList } from "@/lib/api/hooks/analytics/useJobProfiles"
import { JobProfileCard } from "./job-profile-card"

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
