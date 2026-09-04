export type PasswordStrength = {
  score: 0 | 1 | 2 | 3 | 4
  label: string
}

/** Medidor visual — no bloquea el submit (Zod ya valida el mínimo). */
export function getPasswordStrength(password: string): PasswordStrength {
  if (!password) return { score: 0, label: "" }

  let score = 0
  if (password.length >= 8) score += 1
  if (password.length >= 12) score += 1
  if (/\d/.test(password)) score += 1
  if (/[A-ZÁÉÍÓÚÑ]/.test(password) && /[a-záéíóúñ]/.test(password)) score += 1
  if (/[^A-Za-z0-9]/.test(password)) score += 1

  const clamped = Math.min(4, score) as PasswordStrength["score"]
  const labels = ["", "Débil", "Ok", "Buena", "Fuerte"] as const

  return { score: clamped, label: labels[clamped] }
}
