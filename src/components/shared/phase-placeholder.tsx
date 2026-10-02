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
      <p className="text-label-md font-medium uppercase tracking-wide text-primary">
        {APP_NAME} · {phase}
      </p>
      <h1 className="font-display text-headline-lg text-on-surface">{title}</h1>
      {detail ? (
        <p className="text-body-md text-muted-foreground">{detail}</p>
      ) : null}
    </div>
  )
}
