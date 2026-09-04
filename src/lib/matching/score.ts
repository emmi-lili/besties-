/**
 * Algoritmo de compatibilidad — implementación completa en fase 4.
 * Stub tipado para que el resto de la app pueda importar sin romper.
 */
import type { CompatibilityResult, DisponibilidadBloque } from "@/lib/data/types"

export type ScoreInput = {
  respuestasA: Record<string, { opcion: "a" | "b"; peso: number }>
  respuestasB: Record<string, { opcion: "a" | "b"; peso: number }>
  interesesA: string[]
  interesesB: string[]
  energiaA: number
  energiaB: number
  disponibilidadA: DisponibilidadBloque[]
  disponibilidadB: DisponibilidadBloque[]
}

export function computeCompatibility(_input: ScoreInput): CompatibilityResult {
  throw new Error(
    "computeCompatibility: implementar en fase 4 (lib/matching/score.ts)",
  )
}
