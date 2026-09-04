/** Tipos de dominio — fuente de verdad del modelo de datos. */

export type DisponibilidadBloque =
  | "mananas"
  | "tardes_semana"
  | "noches"
  | "findes"

export type InteresCategoria =
  | "salir"
  | "casa"
  | "movimiento"
  | "creativo"
  | "comer"
  | "nerd"

export type JuegoSlug =
  | "esto-o-esto"
  | "dos-verdades"
  | "bingo"
  | "36-preguntas"
  | "reto-semana"

export type SwipeDireccion = "pasar" | "quizas" | "jugar"

export type MatchEstado =
  | "pendiente_juego"
  | "jugando"
  | "chat_desbloqueado"
  | "archivado"

export type SesionJuegoEstado =
  | "esperando"
  | "en_curso"
  | "esperando_otra"
  | "completada"

export type MensajeTipo = "texto" | "sistema" | "sugerencia" | "resultado_juego"

export type InsigniaSlug =
  | "primera-partida"
  | "primer-bingo"
  | "tres-matches-jugando"
  | "detective"
  | "cinco-retos"

export interface User {
  id: string
  email: string
  passwordHash: string
  createdAt: string
  lastLoginAt: string | null
}

export interface Interes {
  id: string
  nombre: string
  categoria: InteresCategoria
  emoji: string
}

export interface Prompt {
  id: string
  texto: string
}

export interface RespuestaPrompt {
  id: string
  profileId: string
  promptId: string
  respuesta: string
}

export interface PreguntaJuego {
  id: string
  juego: JuegoSlug
  texto: string
  opcionA: string
  opcionB: string
  peso: number
}

export interface RespuestaJuego {
  id: string
  profileId: string
  preguntaId: string
  opcion: "a" | "b"
  createdAt: string
}

export interface DosVerdades {
  frase1: string
  frase2: string
  frase3: string
  /** 1 | 2 | 3 — cuál es la mentira */
  mentiraIndex: 1 | 2 | 3
}

export interface Profile {
  id: string
  userId: string
  nombre: string
  edad: number
  ciudad: string
  barrio: string
  bio: string
  fotos: string[]
  /** 0 = una salida al mes, 100 = plan cada finde */
  energiaSocial: number
  disponibilidad: DisponibilidadBloque[]
  interesIds: string[]
  dosVerdades: DosVerdades | null
  onboardingCompleto: boolean
  rachaDias: number
  ultimaActividadAt: string | null
  createdAt: string
}

export interface CreateUserInput {
  email: string
  passwordHash: string
}

export interface ProfileInput {
  nombre: string
  edad: number
  ciudad: string
  barrio: string
  bio?: string
  fotos?: string[]
  energiaSocial?: number
  disponibilidad?: DisponibilidadBloque[]
  interesIds?: string[]
  dosVerdades?: DosVerdades | null
  onboardingCompleto?: boolean
}

export interface FeedFilters {
  ciudad?: string
  edadMin?: number
  edadMax?: number
  ampliarZona?: boolean
}

export interface Swipe {
  id: string
  fromProfileId: string
  toProfileId: string
  direccion: SwipeDireccion
  createdAt: string
}

export interface Match {
  id: string
  profileAId: string
  profileBId: string
  score: number
  razones: string[]
  estado: MatchEstado
  createdAt: string
}

export interface SesionJuego {
  id: string
  matchId: string
  juego: JuegoSlug
  estado: SesionJuegoEstado
  /** perfil cuyo turno es ahora; null si ambas pueden / terminó */
  turnoProfileId: string | null
  createdAt: string
}

export interface RondaJuego {
  id: string
  sesionId: string
  orden: number
  profileId: string
  payload: Record<string, unknown>
  resultado: Record<string, unknown> | null
}

export interface Mensaje {
  id: string
  matchId: string
  senderProfileId: string | null
  contenido: string
  tipo: MensajeTipo
  createdAt: string
  leidoAt: string | null
}

export interface Reto {
  id: string
  titulo: string
  descripcion: string
  semana: string
  tipo: string
}

export interface RetoUsuario {
  id: string
  retoId: string
  profileId: string
  pruebaUrl: string | null
  completadoAt: string | null
}

export interface Insignia {
  id: string
  slug: InsigniaSlug
  nombre: string
  descripcion: string
  emoji: string
  condicion: Record<string, unknown>
}

export interface InsigniaUsuario {
  profileId: string
  insigniaId: string
  ganadaAt: string
}

export interface Reporte {
  id: string
  reporterProfileId: string
  reportadoProfileId: string
  motivo: string
  detalle: string
  createdAt: string
}

export interface Bloqueo {
  id: string
  profileId: string
  bloqueadoId: string
  createdAt: string
}

export interface CompatibilityResult {
  score: number
  razones: string[]
}

export interface CandidateCard {
  profile: Profile
  interesesEnComun: Interes[]
  compatibility: CompatibilityResult
}

export type {
  Amistad,
  Capsula,
  CapsulaRecord,
  CapsulaAdjuntoRecord,
  EntradaDiario,
  Estampilla,
  Lugar,
  Hito,
} from "./types-amistad"

import type {
  Amistad,
  CapsulaAdjuntoRecord,
  CapsulaRecord,
  EntradaDiario,
  Estampilla,
  Hito,
  Lugar,
} from "./types-amistad"

/** Snapshot completo del mock DB (localStorage / memoria). */
export interface MockDatabase {
  users: User[]
  profiles: Profile[]
  intereses: Interes[]
  prompts: Prompt[]
  respuestasPrompt: RespuestaPrompt[]
  preguntasJuego: PreguntaJuego[]
  respuestasJuego: RespuestaJuego[]
  swipes: Swipe[]
  matches: Match[]
  sesionesJuego: SesionJuego[]
  rondasJuego: RondaJuego[]
  mensajes: Mensaje[]
  retos: Reto[]
  retosUsuario: RetoUsuario[]
  insignias: Insignia[]
  insigniasUsuario: InsigniaUsuario[]
  reportes: Reporte[]
  bloqueos: Bloqueo[]
  amistades: Amistad[]
  capsulas: CapsulaRecord[]
  capsulaAdjuntos: CapsulaAdjuntoRecord[]
  entradasDiario: Array<Omit<EntradaDiario, "estampillas">>
  estampillas: Estampilla[]
  lugares: Lugar[]
  hitos: Hito[]
}
