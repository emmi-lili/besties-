/**
 * Contrato compartido de juegos — implementación en fase 5+.
 */
export type JuegoEstado =
  | "idle"
  | "en_curso"
  | "esperando_otra"
  | "revelando"
  | "terminado"

export type JuegoResultado = {
  resumen: string
  coincidencias?: unknown
  diferencias?: unknown
  insignias?: string[]
}

export interface Juego {
  iniciar(): void | Promise<void>
  responder(payload: unknown): void | Promise<void>
  readonly estado: JuegoEstado
  readonly resultado: JuegoResultado | null
}
