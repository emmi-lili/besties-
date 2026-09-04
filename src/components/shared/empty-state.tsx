import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type EmptyStateProps = {
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  className?: string
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-start gap-3 px-1 py-10 text-left",
        className,
      )}
    >
      <h2 className="font-display text-h2 leading-tight text-ink">{title}</h2>
      {description ? (
        <p className="max-w-sm text-body text-muted-foreground">{description}</p>
      ) : null}
      {actionLabel && onAction ? (
        <Button type="button" onClick={onAction} className="mt-2">
          {actionLabel}
        </Button>
      ) : null}
    </div>
  )
}
