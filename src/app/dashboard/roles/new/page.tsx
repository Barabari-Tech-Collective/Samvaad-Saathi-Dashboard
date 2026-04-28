"use client"

import { AddRoleStepper } from "./_components/add-role-stepper"

export default function AddRolePage() {
  return (
    <div className="@container/main flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <div className="px-4 lg:px-6">
        <h1 className="text-lg font-semibold tracking-tight">Add New Role</h1>
        <p className="text-sm text-muted-foreground">
          Create a job profile to generate tailored interview questions.
        </p>
      </div>
      <div className="px-4 lg:px-6">
        <AddRoleStepper />
      </div>
    </div>
  )
}
