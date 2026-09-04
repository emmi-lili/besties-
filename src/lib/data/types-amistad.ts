/** Tipos de la mitad privada (amistad oficial). */

export type AmistadEstado = "propuesta" | "oficial" | "disuelta"

export type CapsulaTipo = "fecha" | "evento" | "necesidad" | "emergencia"

export type CapsulaCondicion =
  | { fecha: string }
  | { evento: string; declarado?: boolean }
  | null

export type CapsulaAdjuntoTipo = "audio" | "foto"

export type EntradaDiarioTipo =
  | "nota"
  | "foto"
  | "voz"
  | "pensamiento"

export type EstampillaSlug =
  | "corazon"
  | "llorar"
  | "reir"
  | "guardado"

export type LugarEstado = "visitado" | "pendiente"

export type HitoTipo =
  | "match"
  | "primera_partida"
  | "primer_encuentro"
  | "capsula_abierta"
  | "lugar_nuevo"
  | "aniversario"
  | "oficial"

export interface Amistad {
  id: string
  profileAId: string
  profileBId: string
  estado: AmistadEstado
  propuestaPorId: string
  oficialDesde: string | null
  matchId: string | null
  createdAt: string
}

export interface CapsulaAdjunto {
  id: string
  capsulaId: string
  tipo: CapsulaAdjuntoTipo
  /** null cuando la cápsula está bloqueada — solo metadata */
  url: string | null
  duracionSeg: number | null
  label: string
  metadata: Record<string, unknown>
}

/**
 * Cápsula tal como la ve el cliente.
 * `contenido` es null hasta que el servidor confirma desbloqueo.
 * // TODO: cifrado E2E — cuando exista, usar contenidoCifrado y copy de cifrado real.
 */
export interface Capsula {
  id: string
  amistadId: string
  autorProfileId: string
  destinatarioProfileId: string
  titulo: string
  tipo: CapsulaTipo
  condicion: CapsulaCondicion
  /** Siempre null en listados/bloqueadas. Solo relleno tras desbloqueo server-side. */
  contenido: string | null
  escritaAt: string
  desbloqueadaAt: string | null
  leidaAt: string | null
  reaccion: string | null
  adjuntos: CapsulaAdjunto[]
}

/** Fila interna del mock (nunca se serializa cruda al cliente). */
export interface CapsulaRecord {
  id: string
  amistadId: string
  autorProfileId: string
  destinatarioProfileId: string
  titulo: string
  tipo: CapsulaTipo
  condicion: CapsulaCondicion
  contenido: string
  // TODO: cifrado E2E → contenidoCifrado
  escritaAt: string
  desbloqueadaAt: string | null
  leidaAt: string | null
  reaccion: string | null
}

export interface CapsulaAdjuntoRecord {
  id: string
  capsulaId: string
  tipo: CapsulaAdjuntoTipo
  url: string
  duracionSeg: number | null
  label: string
  metadata: Record<string, unknown>
}

export interface CreateCapsulaInput {
  amistadId: string
  autorProfileId: string
  destinatarioProfileId: string
  titulo: string
  tipo: CapsulaTipo
  condicion: CapsulaCondicion
  contenido: string
  adjuntos?: Array<{
    tipo: CapsulaAdjuntoTipo
    url: string
    duracionSeg?: number | null
    label: string
    metadata?: Record<string, unknown>
  }>
}

export interface EntradaDiario {
  id: string
  amistadId: string
  autorProfileId: string
  tipo: EntradaDiarioTipo
  contenido: string
  mediaUrl: string | null
  lugarId: string | null
  createdAt: string
  estampillas: Estampilla[]
}

export interface Estampilla {
  id: string
  entradaId: string
  autorProfileId: string
  slug: EstampillaSlug
  rotacion: number
}

export interface Lugar {
  id: string
  amistadId: string
  nombre: string
  ciudad: string
  lat: number | null
  lng: number | null
  estado: LugarEstado
  visitadoAt: string | null
  propuestoPorId: string
  fotoUrl: string | null
  linea: string | null
}

export interface Hito {
  id: string
  amistadId: string
  tipo: HitoTipo
  payload: Record<string, unknown>
  ocurrioAt: string
}
