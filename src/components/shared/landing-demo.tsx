"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { Button } from "@/components/ui/button"

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
      reduceMotion ? 0 : 450,
    )
  }

  return (
    <div className="space-y-4">
      <p className="text-caption font-medium text-ink/60">Probá Esto o Esto</p>
      <motion.div
        layout
        className="rounded-2xl border border-border bg-white p-5 shadow-[0_12px_40px_-24px_rgba(28,25,23,0.35)]"
      >
        <p className="font-display text-h2 leading-snug text-ink">
          Café a las 7am o vino a las 11pm?
        </p>
        <div className="mt-6 grid gap-3">
          <Button
            type="button"
            size="lg"
            variant={picked === "a" ? "default" : "outline"}
            className="h-12 justify-start px-4 text-left font-display text-body"
            onClick={() => choose("a")}
            disabled={picked !== null}
          >
            Café a las 7am
          </Button>
          <Button
            type="button"
            size="lg"
            variant={picked === "b" ? "default" : "outline"}
            className="h-12 justify-start px-4 text-left font-display text-body"
            onClick={() => choose("b")}
            disabled={picked !== null}
          >
            Vino a las 11pm
          </Button>
        </div>
      </motion.div>
    </div>
  )
}

export { DEMO_KEY as LANDING_DEMO_KEY }
