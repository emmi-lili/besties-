import { APP_NAME } from "@/lib/constants"

type PhasePlaceholderProps = {
  title: string
  phase: string
  detail?: string
}

export function PhasePlaceholder({
  title,
  phase,
  detail,
}: PhasePlaceholderProps) {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-3 px-4 py-12">
      <p className="text-caption font-medium uppercase tracking-wide text-tomato">
        {APP_NAME} · {phase}
      </p>
      <h1 className="font-display text-h1 text-ink">{title}</h1>
      {detail ? (
        <p className="text-body text-muted-foreground">{detail}</p>
      ) : null}
    </div>
  )
}
