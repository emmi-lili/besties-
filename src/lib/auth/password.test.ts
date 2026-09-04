import { describe, expect, it } from "vitest"
import { getPasswordStrength } from "@/lib/auth/password-strength"
import { hashPassword, verifyPassword } from "@/lib/auth/password"

describe("fase 2 — passwords", () => {
  it("hashea y verifica sin guardar texto plano", async () => {
    const plain = "secreto99"
    const hash = await hashPassword(plain)
    expect(hash).not.toContain(plain)
    expect(hash.startsWith("$2")).toBe(true)
    expect(await verifyPassword(plain, hash)).toBe(true)
    expect(await verifyPassword("otra99xx", hash)).toBe(false)
  })

  it("medidor de fuerza no bloquea — solo puntúa", () => {
    expect(getPasswordStrength("").score).toBe(0)
    expect(getPasswordStrength("abc").score).toBeLessThan(2)
    expect(getPasswordStrength("abcdefgh1").score).toBeGreaterThanOrEqual(2)
  })
})
