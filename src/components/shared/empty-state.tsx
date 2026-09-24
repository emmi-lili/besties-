import type { LucideIcon } from "lucide-react"
import { Inbox } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type EmptyStateProps = {
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  icon?: LucideIcon
  className?: string
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  icon: Icon = Inbox,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-5 px-4 py-14 text-center animate-fade-in-up",
        className,
      )}
    >
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-surface-container blur-xl" />
        <div className="relative flex size-16 items-center justify-center rounded-2xl border border-outline-variant/50 bg-gradient-to-br from-surface-container-lowest to-surface-container shadow-md">
          <Icon className="size-7 text-on-surface-variant" strokeWidth={1.5} />
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="font-display text-headline-md leading-tight text-ink text-balance">
          {title}
        </h2>
        {description ? (
          <p className="max-w-xs text-body-md text-muted-foreground text-pretty">
            {description}
          </p>
        ) : null}
      </div>

      {actionLabel && onAction ? (
        <Button
          type="button"
          onClick={onAction}
          className="mt-1 shadow-sm shadow-primary/10"
        >
          {actionLabel}
        </Button>
      ) : null}
    </div>
  )
}
