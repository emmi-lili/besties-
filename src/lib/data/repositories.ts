import type {
  CandidateCard,
  CreateUserInput,
  FeedFilters,
  Match,
  Mensaje,
  Profile,
  ProfileInput,
  Reto,
  RetoUsuario,
  SesionJuego,
  Swipe,
  SwipeDireccion,
  User,
  JuegoSlug,
  RondaJuego,
} from "./types"

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>
  findById(id: string): Promise<User | null>
  create(data: CreateUserInput): Promise<User>
  updatePassword(id: string, passwordHash: string): Promise<void>
  touchLastLogin(id: string): Promise<void>
}

export interface ProfileRepository {
  getByUserId(userId: string): Promise<Profile | null>
  getById(id: string): Promise<Profile | null>
  upsert(userId: string, data: ProfileInput): Promise<Profile>
  getCandidates(userId: string, filtros: FeedFilters): Promise<CandidateCard[]>
}

export interface MatchRepository {
  swipe(
    fromProfileId: string,
    toProfileId: string,
    direccion: SwipeDireccion,
  ): Promise<{ swipe: Swipe; match: Match | null }>
  listMatches(profileId: string): Promise<Match[]>
  getMatch(matchId: string): Promise<Match | null>
  unmatch(matchId: string, profileId: string): Promise<void>
  updateEstado(matchId: string, estado: Match["estado"]): Promise<Match>
}

export interface GameRepository {
  createSession(
    matchId: string,
    juego: JuegoSlug,
    initiatorProfileId: string,
  ): Promise<SesionJuego>
  getSession(sessionId: string): Promise<SesionJuego | null>
  listSessionsByMatch(matchId: string): Promise<SesionJuego[]>
  listOpenSessions(profileId: string): Promise<SesionJuego[]>
  submitRound(
    sessionId: string,
    profileId: string,
    orden: number,
    payload: Record<string, unknown>,
  ): Promise<RondaJuego>
  getRounds(sessionId: string): Promise<RondaJuego[]>
  completeSession(sessionId: string): Promise<SesionJuego>
}

export interface MessageRepository {
  list(matchId: string): Promise<Mensaje[]>
  send(
    matchId: string,
    senderProfileId: string,
    contenido: string,
    tipo?: Mensaje["tipo"],
  ): Promise<Mensaje>
  markRead(matchId: string, profileId: string): Promise<void>
  countUnread(matchId: string, profileId: string): Promise<number>
}

export interface ChallengeRepository {
  current(): Promise<Reto | null>
  join(retoId: string, profileId: string): Promise<RetoUsuario>
  submitProof(
    retoId: string,
    profileId: string,
    pruebaUrl: string,
  ): Promise<RetoUsuario>
  listProofsForMatches(profileId: string): Promise<RetoUsuario[]>
  countParticipants(retoId: string): Promise<number>
}

export interface SafetyRepository {
  block(profileId: string, bloqueadoId: string): Promise<void>
  report(
    reporterProfileId: string,
    reportadoProfileId: string,
    motivo: string,
    detalle: string,
  ): Promise<void>
  isBlocked(profileId: string, otherId: string): Promise<boolean>
  listBlockedIds(profileId: string): Promise<string[]>
}

import type {
  ChallengeRepository,
  DataLayer,
  GameRepository,
  MatchRepository,
  MessageRepository,
  ProfileRepository,
  SafetyRepository,
  UserRepository,
} from "../repositories"
import type {
  CapsuleRepository,
  DiaryRepository,
  FriendshipRepository,
  MilestoneRepository,
  PlaceRepository,
} from "../repositories-amistad"

export interface DataLayer {
  users: UserRepository
  profiles: ProfileRepository
  matches: MatchRepository
  games: GameRepository
  messages: MessageRepository
  challenges: ChallengeRepository
  safety: SafetyRepository
  friendships: FriendshipRepository
  capsules: CapsuleRepository
  diary: DiaryRepository
  places: PlaceRepository
  milestones: MilestoneRepository
}
