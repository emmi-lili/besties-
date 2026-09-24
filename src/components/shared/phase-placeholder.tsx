import { Sparkles, Rocket, Construction } from "lucide-react"
import { APP_NAME } from "@/lib/constants"

type PhasePlaceholderProps = {
  title: string
  phase: string
  detail?: string
  icon?: "sparkles" | "rocket" | "construction"
}

const ICONS = {
  sparkles: Sparkles,
  rocket: Rocket,
  construction: Construction,
}

export function PhasePlaceholder({
  title,
  phase,
  detail,
  icon = "sparkles",
}: PhasePlaceholderProps) {
  const Icon = ICONS[icon]

  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center gap-6 px-4 py-16 text-center">
      <div className="relative animate-fade-in-up">
        <div className="absolute inset-0 rounded-full bg-primary/10 blur-2xl" />
        <div className="relative flex size-20 items-center justify-center rounded-2xl border border-primary/20 bg-gradient-to-br from-primary-container/80 to-primary-container/40 shadow-lg shadow-primary/10">
          <Icon className="size-9 text-primary" strokeWidth={1.5} />
        </div>
      </div>

      <div className="animate-fade-in-up stagger-1 space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-container/40 px-3 py-1">
          <span className="size-1.5 animate-pulse rounded-full bg-primary" />
          <p className="text-label-sm font-medium uppercase tracking-wide text-primary">
            {APP_NAME} · {phase}
          </p>
        </div>
        <h1 className="font-display text-headline-lg text-ink text-balance">
          {title}
        </h1>
      </div>

      {detail ? (
        <p className="animate-fade-in-up stagger-2 max-w-sm text-body-md text-muted-foreground text-pretty">
          {detail}
        </p>
      ) : null}

      <div className="animate-fade-in-up stagger-3 flex items-center gap-3 pt-2">
        <div className="h-px w-8 bg-gradient-to-r from-transparent to-outline-variant" />
        <p className="text-label-sm text-muted-foreground">Próximamente</p>
        <div className="h-px w-8 bg-gradient-to-l from-transparent to-outline-variant" />
      </div>
    </div>
  )
}
