import type {
  Amistad,
  Capsula,
  CreateCapsulaInput,
  EntradaDiario,
  Estampilla,
  EstampillaSlug,
  Hito,
  Lugar,
} from "./types-amistad"

export interface FriendshipRepository {
  propose(matchId: string, fromProfileId: string): Promise<Amistad>
  accept(amistadId: string, profileId: string): Promise<Amistad>
  decline(amistadId: string, profileId: string): Promise<void>
  getById(amistadId: string): Promise<Amistad | null>
  listForProfile(profileId: string): Promise<Amistad[]>
  getByMatchId(matchId: string): Promise<Amistad | null>
  /** Solo mock/dev: crea amistad oficial con un perfil seed. */
  createDemoOfficial(profileId: string): Promise<Amistad>
}

export interface CapsuleRepository {
  list(amistadId: string, viewerProfileId: string): Promise<Capsula[]>
  getById(capsulaId: string, viewerProfileId: string): Promise<Capsula | null>
  create(input: CreateCapsulaInput): Promise<Capsula>
  /** Abre con sello — solo si canOpen. Devuelve contenido. */
  open(capsulaId: string, viewerProfileId: string): Promise<Capsula>
  declareEvent(capsulaId: string, profileId: string): Promise<Capsula>
  setReaction(capsulaId: string, profileId: string, reaccion: string): Promise<void>
}

export interface DiaryRepository {
  listByMonth(
    amistadId: string,
    year: number,
    monthIndex: number,
  ): Promise<EntradaDiario[]>
  create(input: {
    amistadId: string
    autorProfileId: string
    tipo: EntradaDiario["tipo"]
    contenido: string
    mediaUrl?: string | null
    lugarId?: string | null
  }): Promise<EntradaDiario>
  addStamp(
    entradaId: string,
    autorProfileId: string,
    slug: EstampillaSlug,
  ): Promise<Estampilla>
}

export interface PlaceRepository {
  list(amistadId: string): Promise<Lugar[]>
  create(input: {
    amistadId: string
    nombre: string
    ciudad: string
    propuestoPorId: string
    estado?: Lugar["estado"]
    lat?: number | null
    lng?: number | null
    linea?: string | null
    fotoUrl?: string | null
  }): Promise<Lugar>
  markVisited(
    lugarId: string,
    profileId: string,
    fotoUrl?: string | null,
  ): Promise<Lugar>
}

export interface MilestoneRepository {
  list(amistadId: string): Promise<Hito[]>
  add(input: Omit<Hito, "id">): Promise<Hito>
}
