"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { Coffee, Wine, Sparkles, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const DEMO_KEY = "amiguis:landing-demo"

export function LandingDemo() {
  const router = useRouter()
  const reduceMotion = useReducedMotion()
  const [picked, setPicked] = useState<"a" | "b" | null>(null)

  function choose(side: "a" | "b") {
    setPicked(side)
    try {
      sessionStorage.setItem(
        DEMO_KEY,
        JSON.stringify({
          preguntaId: "ee-01",
          opcion: side,
        }),
      )
    } catch {
      /* ignore */
    }
    window.setTimeout(
      () => {
        router.push("/registro")
      },
      reduceMotion ? 0 : 550,
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Sparkles className="size-4 text-accent-gold" />
        <p className="text-label-md font-medium text-on-surface-variant">
          Probá Esto o Esto
        </p>
      </div>
      <motion.div
        layout
        className="relative overflow-hidden rounded-2xl border border-border/60 bg-surface-container-lowest p-6 shadow-[0_8px_32px_-12px_rgba(28,20,18,0.15),0_16px_48px_-24px_rgba(196,92,122,0.1)]"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-8 -top-8 size-32 rounded-full bg-gradient-to-br from-primary-container/40 to-transparent blur-2xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-8 -left-8 size-32 rounded-full bg-gradient-to-br from-accent-gold/20 to-transparent blur-2xl"
        />

        <div className="relative">
          <p className="font-display text-headline-md leading-snug text-ink text-balance">
            Café a las 7am o vino a las 11pm?
          </p>

          <div className="mt-6 grid gap-3">
            <Button
              type="button"
              size="lg"
              variant={picked === "a" ? "default" : "outline"}
              className={cn(
                "group relative h-14 justify-start gap-3 overflow-hidden px-4 text-left font-display text-body-md transition-all duration-300",
                picked === "a" && "shadow-md shadow-primary/20",
                picked === "b" && "opacity-50",
              )}
              onClick={() => choose("a")}
              disabled={picked !== null}
            >
              <span
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-lg transition-all duration-300",
                  picked === "a"
                    ? "bg-on-primary/20"
                    : "bg-tertiary-container/60 group-hover:bg-tertiary-container",
                )}
              >
                {picked === "a" ? (
                  <Check className="size-4 animate-scale-in text-on-primary" />
                ) : (
                  <Coffee className="size-4 transition-colors text-tertiary" />
                )}
              </span>
              <span>Café a las 7am</span>
            </Button>

            <Button
              type="button"
              size="lg"
              variant={picked === "b" ? "default" : "outline"}
              className={cn(
                "group relative h-14 justify-start gap-3 overflow-hidden px-4 text-left font-display text-body-md transition-all duration-300",
                picked === "b" && "shadow-md shadow-primary/20",
                picked === "a" && "opacity-50",
              )}
              onClick={() => choose("b")}
              disabled={picked !== null}
            >
              <span
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-lg transition-all duration-300",
                  picked === "b"
                    ? "bg-on-primary/20"
                    : "bg-primary-container/60 group-hover:bg-primary-container",
                )}
              >
                {picked === "b" ? (
                  <Check className="size-4 animate-scale-in text-on-primary" />
                ) : (
                  <Wine className="size-4 transition-colors text-primary" />
                )}
              </span>
              <span>Vino a las 11pm</span>
            </Button>
          </div>

          {picked && (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 text-center text-label-md text-muted-foreground"
            >
              Excelente elección ✨
            </motion.p>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export { DEMO_KEY as LANDING_DEMO_KEY }
