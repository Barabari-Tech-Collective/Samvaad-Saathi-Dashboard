import * as React from "react"

import { cn } from "@/lib/utils"

export function StudentDetailEmpty({
  title,
  description,
  className,
}: Readonly<{
  title: string
  description?: string
  className?: string
}>) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border border-dashed bg-muted/30 px-6 py-10 text-center",
        className,
      )}
    >
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
      {description ? <p className="mt-1 max-w-sm text-xs text-muted-foreground">{description}</p> : null}
    </div>
  )
}
