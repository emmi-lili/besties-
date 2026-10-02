"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"

const HOLD_MS = 1200

type SealButtonProps = {
  onComplete: () => void | Promise<void>
  disabled?: boolean
  label?: string
}

export function SealButton({
  onComplete,
  disabled,
  label = "Mantener para abrir",
}: SealButtonProps) {
  const reduceMotion = useReducedMotion()
  const [progress, setProgress] = useState(0)
  const [pressing, setPressing] = useState(false)
  const [done, setDone] = useState(false)
  const raf = useRef<number | null>(null)
  const start = useRef<number | null>(null)
  const finishing = useRef(false)

  const clear = useCallback(() => {
    if (raf.current) cancelAnimationFrame(raf.current)
    raf.current = null
    start.current = null
    setPressing(false)
    if (!finishing.current) setProgress(0)
  }, [])

  const tick = useCallback(
    (ts: number) => {
      if (start.current === null) start.current = ts
      const p = Math.min(1, (ts - start.current) / HOLD_MS)
      setProgress(p)
      if (p >= 1) {
        finishing.current = true
        setDone(true)
        setPressing(false)
        void onComplete()
        return
      }
      raf.current = requestAnimationFrame(tick)
    },
    [onComplete],
  )

  const begin = () => {
    if (disabled || done || finishing.current) return
    if (reduceMotion) {
      // Tap + confirm path for reduced motion
      const ok = window.confirm("¿Abrir esta cápsula?")
      if (ok) {
        setDone(true)
        void onComplete()
      }
      return
    }
    setPressing(true)
    start.current = null
    raf.current = requestAnimationFrame(tick)
  }

  useEffect(() => () => clear(), [clear])

  const size = 96
  const stroke = 4
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const offset = c * (1 - progress)

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        disabled={disabled || done}
        aria-label={label}
        onPointerDown={begin}
        onPointerUp={clear}
        onPointerLeave={clear}
        onPointerCancel={clear}
        className={cn(
          "relative flex size-24 items-center justify-center rounded-full bg-primary text-on-primary shadow-paper-3 select-none",
          "transition-[transform] duration-200 ease-out",
          pressing && "scale-[0.96]",
          (disabled || done) && "opacity-50",
        )}
        style={{ touchAction: "none" }}
      >
        <svg
          className="pointer-events-none absolute inset-0 -rotate-90"
          width={size}
          height={size}
          aria-hidden
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="color-mix(in srgb, var(--on-primary) 35%, transparent)"
            strokeWidth={stroke}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="var(--accent-gold)"
            strokeWidth={stroke}
            strokeDasharray={c}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        <span className="font-sans text-label-md font-medium">Sello</span>
      </button>
      <p className="font-serif text-body-md italic text-on-surface-variant">
        {reduceMotion ? "Tocá para confirmar" : label}
      </p>
    </div>
  )
}
