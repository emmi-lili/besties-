import { describe, expect, it } from "vitest"
import { seed } from "@/lib/data/mock/seed"
import { getDataLayer } from "@/lib/data"
import { DATA_SOURCE } from "@/lib/constants"

describe("fase 1 — mock seed", () => {
  it("carga 12 perfiles con onboarding completo", () => {
    const db = seed()
    expect(db.profiles).toHaveLength(12)
    expect(db.users).toHaveLength(12)
    expect(db.profiles.every((p) => p.onboardingCompleto)).toBe(true)
    expect(db.preguntasJuego.length).toBeGreaterThanOrEqual(15)
    expect(db.respuestasJuego.length).toBe(12 * 15)
  })

  it("getDataLayer usa mock por defecto", () => {
    expect(DATA_SOURCE).toBe("mock")
    const layer = getDataLayer()
    expect(layer.users).toBeDefined()
    expect(layer.profiles).toBeDefined()
  })
})
