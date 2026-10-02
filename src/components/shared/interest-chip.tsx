"use client"

import { cn } from "@/lib/utils"

type InterestChipProps = {
  label: string
  emoji?: string
  selected?: boolean
  shared?: boolean
  onClick?: () => void
  disabled?: boolean
}

export function InterestChip({
  label,
  emoji,
  selected,
  shared,
  onClick,
  disabled,
}: InterestChipProps) {
  const interactive = Boolean(onClick)
  const Comp = interactive ? "button" : "span"

  return (
    <Comp
      type={interactive ? "button" : undefined}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-label-md transition-colors",
        shared && "border-secondary bg-secondary/10 text-secondary",
        selected && !shared && "border-primary bg-primary/10 text-primary",
        !selected &&
          !shared &&
          "border-border bg-white text-on-surface hover:border-ink/30",
        interactive && "cursor-pointer",
        disabled && "opacity-50",
      )}
    >
      {emoji ? <span aria-hidden>{emoji}</span> : null}
      {label}
    </Comp>
  )
}
