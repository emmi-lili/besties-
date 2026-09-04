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
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-caption transition-colors",
        shared && "border-forest bg-forest/10 text-forest",
        selected && !shared && "border-tomato bg-tomato/10 text-tomato",
        !selected &&
          !shared &&
          "border-border bg-white text-ink hover:border-ink/30",
        interactive && "cursor-pointer",
        disabled && "opacity-50",
      )}
    >
      {emoji ? <span aria-hidden>{emoji}</span> : null}
      {label}
    </Comp>
  )
}
