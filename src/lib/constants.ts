/** Nombre de trabajo — cambiar acá cuando haya nombre definitivo. */
export const APP_NAME = "Amiguis"

export const DB_STORAGE_KEY = "amiguis:db"

export const DATA_SOURCE =
  (process.env.NEXT_PUBLIC_DATA_SOURCE as "mock" | "supabase" | undefined) ??
  "mock"

export const SESSION_COOKIE = "amiguis_session"
export const SESSION_MAX_AGE_DAYS = 30

export const ONBOARDING_STEPS = [
  "basicos",
  "fotos",
  "intereses",
  "verdades",
  "esto-o-esto",
  "energia",
] as const

export type OnboardingStep = (typeof ONBOARDING_STEPS)[number]
