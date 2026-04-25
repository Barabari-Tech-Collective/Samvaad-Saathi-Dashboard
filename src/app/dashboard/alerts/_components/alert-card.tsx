import { Badge } from "@/components/ui/badge"

interface AlertCardProps {
  alert: {
    type: string
    message: string
    role?: string | null
  }
  index: number
}

export function AlertCard({ alert, index }: AlertCardProps) {
  return (
    <div key={`${alert.type}-${index}`} className="rounded-md border px-3 py-2">
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="text-xs">
          {alert.type.replaceAll("_", " ")}
        </Badge>
        {typeof alert.role === "string" ? (
          <span className="text-xs text-muted-foreground capitalize">{alert.role}</span>
        ) : null}
      </div>
      <p className="mt-1 text-sm text-muted-foreground">{alert.message}</p>
    </div>
  )
}
