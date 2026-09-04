import { nanoid } from "nanoid"
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
  CandidateCard,
  CreateUserInput,
  FeedFilters,
  Match,
  Mensaje,
  Profile,
  ProfileInput,
  RetoUsuario,
  SesionJuego,
  Swipe,
  SwipeDireccion,
  User,
  JuegoSlug,
  RondaJuego,
} from "../types"
import { getDb, mutateDb } from "./store"

function nowIso() {
  return new Date().toISOString()
}

const users: UserRepository = {
  async findByEmail(email) {
    const normalized = email.trim().toLowerCase()
    return getDb().users.find((u) => u.email === normalized) ?? null
  },
  async findById(id) {
    return getDb().users.find((u) => u.id === id) ?? null
  },
  async create(data: CreateUserInput) {
    let created: User | null = null
    mutateDb((db) => {
      created = {
        id: nanoid(),
        email: data.email.trim().toLowerCase(),
        passwordHash: data.passwordHash,
        createdAt: nowIso(),
        lastLoginAt: null,
      }
      db.users.push(created)
    })
    return created!
  },
  async updatePassword(id, passwordHash) {
    mutateDb((db) => {
      const user = db.users.find((u) => u.id === id)
      if (user) user.passwordHash = passwordHash
    })
  },
  async touchLastLogin(id) {
    mutateDb((db) => {
      const user = db.users.find((u) => u.id === id)
      if (user) user.lastLoginAt = nowIso()
    })
  },
}

const profiles: ProfileRepository = {
  async getByUserId(userId) {
    return getDb().profiles.find((p) => p.userId === userId) ?? null
  },
  async getById(id) {
    return getDb().profiles.find((p) => p.id === id) ?? null
  },
  async upsert(userId, data: ProfileInput) {
    let result: Profile | null = null
    mutateDb((db) => {
      const existing = db.profiles.find((p) => p.userId === userId)
      if (existing) {
        Object.assign(existing, {
          nombre: data.nombre,
          edad: data.edad,
          ciudad: data.ciudad,
          barrio: data.barrio,
          bio: data.bio ?? existing.bio,
          fotos: data.fotos ?? existing.fotos,
          energiaSocial: data.energiaSocial ?? existing.energiaSocial,
          disponibilidad: data.disponibilidad ?? existing.disponibilidad,
          interesIds: data.interesIds ?? existing.interesIds,
          dosVerdades:
            data.dosVerdades !== undefined
              ? data.dosVerdades
              : existing.dosVerdades,
          onboardingCompleto:
            data.onboardingCompleto ?? existing.onboardingCompleto,
        })
        result = existing
      } else {
        result = {
          id: nanoid(),
          userId,
          nombre: data.nombre,
          edad: data.edad,
          ciudad: data.ciudad,
          barrio: data.barrio,
          bio: data.bio ?? "",
          fotos: data.fotos ?? [],
          energiaSocial: data.energiaSocial ?? 50,
          disponibilidad: data.disponibilidad ?? [],
          interesIds: data.interesIds ?? [],
          dosVerdades: data.dosVerdades ?? null,
          onboardingCompleto: data.onboardingCompleto ?? false,
          rachaDias: 0,
          ultimaActividadAt: null,
          createdAt: nowIso(),
        }
        db.profiles.push(result)
      }
    })
    return result!
  },
  async getCandidates(userId, filtros: FeedFilters) {
    const db = getDb()
    const me = db.profiles.find((p) => p.userId === userId)
    if (!me || !me.onboardingCompleto) return []

    const blocked = new Set<string>()
    for (const b of db.bloqueos) {
      if (b.profileId === me.id) blocked.add(b.bloqueadoId)
      if (b.bloqueadoId === me.id) blocked.add(b.profileId)
    }

    const swiped = new Set(
      db.swipes
        .filter((s) => s.fromProfileId === me.id)
        .map((s) => s.toProfileId),
    )

    const cards: CandidateCard[] = []

    for (const profile of db.profiles) {
      if (profile.id === me.id) continue
      if (!profile.onboardingCompleto) continue
      if (blocked.has(profile.id)) continue
      if (swiped.has(profile.id)) continue
      if (!filtros.ampliarZona && filtros.ciudad && profile.ciudad !== filtros.ciudad) {
        if (profile.ciudad !== me.ciudad) continue
      } else if (!filtros.ampliarZona && profile.ciudad !== me.ciudad) {
        continue
      }
      if (filtros.edadMin && profile.edad < filtros.edadMin) continue
      if (filtros.edadMax && profile.edad > filtros.edadMax) continue

      const sharedIds = profile.interesIds.filter((id) =>
        me.interesIds.includes(id),
      )
      const interesesEnComun = db.intereses.filter((i) =>
        sharedIds.includes(i.id),
      )

      // Score placeholder en fase 1 — el algoritmo real llega en fase 4.
      const jaccard =
        sharedIds.length /
        new Set([...me.interesIds, ...profile.interesIds]).size
      const energia =
        1 - Math.abs(me.energiaSocial - profile.energiaSocial) / 100
      const score = Math.round((0.25 * jaccard + 0.2 * energia + 0.55) * 100)
      const razones: string[] = []
      if (sharedIds.length >= 2) {
        razones.push(
          `las dos comparten ${interesesEnComun
            .slice(0, 2)
            .map((i) => i.nombre.toLowerCase())
            .join(" y ")}`,
        )
      }
      if (energia > 0.8) {
        razones.push("ritmo social parecido")
      }
      if (razones.length === 0) {
        razones.push("hay química de juego por descubrir")
      }

      cards.push({
        profile,
        interesesEnComun,
        compatibility: { score: Math.min(99, Math.max(40, score)), razones },
      })
    }

    return cards.sort(
      (a, b) => b.compatibility.score - a.compatibility.score,
    )
  },
}

const matches: MatchRepository = {
  async swipe(fromProfileId, toProfileId, direccion: SwipeDireccion) {
    let swipe: Swipe | null = null
    let match: Match | null = null

    mutateDb((db) => {
      swipe = {
        id: nanoid(),
        fromProfileId,
        toProfileId,
        direccion,
        createdAt: nowIso(),
      }
      db.swipes.push(swipe)

      if (direccion === "jugar") {
        const reciprocal = db.swipes.find(
          (s) =>
            s.fromProfileId === toProfileId &&
            s.toProfileId === fromProfileId &&
            s.direccion === "jugar",
        )
        if (reciprocal) {
          const [a, b] = [fromProfileId, toProfileId].sort()
          const exists = db.matches.find(
            (m) =>
              (m.profileAId === a && m.profileBId === b) ||
              (m.profileAId === b && m.profileBId === a),
          )
          if (!exists) {
            match = {
              id: nanoid(),
              profileAId: a,
              profileBId: b,
              score: 0,
              razones: [],
              estado: "pendiente_juego",
              createdAt: nowIso(),
            }
            db.matches.push(match)
          } else {
            match = exists
          }
        }
      }
    })

    return { swipe: swipe!, match }
  },
  async listMatches(profileId) {
    return getDb().matches.filter(
      (m) =>
        (m.profileAId === profileId || m.profileBId === profileId) &&
        m.estado !== "archivado",
    )
  },
  async getMatch(matchId) {
    return getDb().matches.find((m) => m.id === matchId) ?? null
  },
  async unmatch(matchId) {
    mutateDb((db) => {
      const m = db.matches.find((x) => x.id === matchId)
      if (m) m.estado = "archivado"
    })
  },
  async updateEstado(matchId, estado) {
    let updated: Match | null = null
    mutateDb((db) => {
      const m = db.matches.find((x) => x.id === matchId)
      if (m) {
        m.estado = estado
        updated = m
      }
    })
    if (!updated) throw new Error("Match no encontrado")
    return updated
  },
}

const games: GameRepository = {
  async createSession(matchId, juego: JuegoSlug, initiatorProfileId) {
    let session: SesionJuego | null = null
    mutateDb((db) => {
      session = {
        id: nanoid(),
        matchId,
        juego,
        estado: "en_curso",
        turnoProfileId: initiatorProfileId,
        createdAt: nowIso(),
      }
      db.sesionesJuego.push(session)
      const match = db.matches.find((m) => m.id === matchId)
      if (match && match.estado === "pendiente_juego") {
        match.estado = "jugando"
      }
    })
    return session!
  },
  async getSession(sessionId) {
    return getDb().sesionesJuego.find((s) => s.id === sessionId) ?? null
  },
  async listSessionsByMatch(matchId) {
    return getDb().sesionesJuego.filter((s) => s.matchId === matchId)
  },
  async listOpenSessions(profileId) {
    const db = getDb()
    const myMatches = new Set(
      db.matches
        .filter(
          (m) => m.profileAId === profileId || m.profileBId === profileId,
        )
        .map((m) => m.id),
    )
    return db.sesionesJuego.filter(
      (s) =>
        myMatches.has(s.matchId) &&
        s.estado !== "completada" &&
        s.estado !== "esperando",
    )
  },
  async submitRound(sessionId, profileId, orden, payload) {
    let round: RondaJuego | null = null
    mutateDb((db) => {
      round = {
        id: nanoid(),
        sesionId: sessionId,
        orden,
        profileId,
        payload,
        resultado: null,
      }
      db.rondasJuego.push(round)
    })
    return round!
  },
  async getRounds(sessionId) {
    return getDb()
      .rondasJuego.filter((r) => r.sesionId === sessionId)
      .sort((a, b) => a.orden - b.orden)
  },
  async completeSession(sessionId) {
    let session: SesionJuego | null = null
    mutateDb((db) => {
      const s = db.sesionesJuego.find((x) => x.id === sessionId)
      if (s) {
        s.estado = "completada"
        s.turnoProfileId = null
        session = s
        const match = db.matches.find((m) => m.id === s.matchId)
        if (match && s.juego === "esto-o-esto") {
          match.estado = "chat_desbloqueado"
        }
      }
    })
    if (!session) throw new Error("Sesión no encontrada")
    return session
  },
}

const messages: MessageRepository = {
  async list(matchId) {
    return getDb()
      .mensajes.filter((m) => m.matchId === matchId)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
  },
  async send(matchId, senderProfileId, contenido, tipo: Mensaje["tipo"] = "texto") {
    let msg: Mensaje | null = null
    mutateDb((db) => {
      msg = {
        id: nanoid(),
        matchId,
        senderProfileId,
        contenido,
        tipo,
        createdAt: nowIso(),
        leidoAt: null,
      }
      db.mensajes.push(msg)
    })
    return msg!
  },
  async markRead(matchId, profileId) {
    mutateDb((db) => {
      for (const m of db.mensajes) {
        if (
          m.matchId === matchId &&
          m.senderProfileId !== profileId &&
          !m.leidoAt
        ) {
          m.leidoAt = nowIso()
        }
      }
    })
  },
  async countUnread(matchId, profileId) {
    return getDb().mensajes.filter(
      (m) =>
        m.matchId === matchId &&
        m.senderProfileId !== profileId &&
        !m.leidoAt,
    ).length
  },
}

const challenges: ChallengeRepository = {
  async current() {
    const retos = getDb().retos
    return retos[retos.length - 1] ?? null
  },
  async join(retoId, profileId) {
    let row: RetoUsuario | null = null
    mutateDb((db) => {
      const existing = db.retosUsuario.find(
        (r) => r.retoId === retoId && r.profileId === profileId,
      )
      if (existing) {
        row = existing
        return
      }
      row = {
        id: nanoid(),
        retoId,
        profileId,
        pruebaUrl: null,
        completadoAt: null,
      }
      db.retosUsuario.push(row)
    })
    return row!
  },
  async submitProof(retoId, profileId, pruebaUrl) {
    let row: RetoUsuario | null = null
    mutateDb((db) => {
      let existing = db.retosUsuario.find(
        (r) => r.retoId === retoId && r.profileId === profileId,
      )
      if (!existing) {
        existing = {
          id: nanoid(),
          retoId,
          profileId,
          pruebaUrl: null,
          completadoAt: null,
        }
        db.retosUsuario.push(existing)
      }
      existing.pruebaUrl = pruebaUrl
      existing.completadoAt = nowIso()
      row = existing
    })
    return row!
  },
  async listProofsForMatches(profileId) {
    const db = getDb()
    const matchProfileIds = new Set<string>()
    for (const m of db.matches) {
      if (m.profileAId === profileId) matchProfileIds.add(m.profileBId)
      if (m.profileBId === profileId) matchProfileIds.add(m.profileAId)
    }
    return db.retosUsuario.filter(
      (r) =>
        matchProfileIds.has(r.profileId) && r.completadoAt && r.pruebaUrl,
    )
  },
  async countParticipants(retoId) {
    return getDb().retosUsuario.filter((r) => r.retoId === retoId).length
  },
}

const safety: SafetyRepository = {
  async block(profileId, bloqueadoId) {
    mutateDb((db) => {
      const already = db.bloqueos.some(
        (b) =>
          (b.profileId === profileId && b.bloqueadoId === bloqueadoId) ||
          (b.profileId === bloqueadoId && b.bloqueadoId === profileId),
      )
      if (!already) {
        const ts = nowIso()
        db.bloqueos.push(
          {
            id: nanoid(),
            profileId,
            bloqueadoId,
            createdAt: ts,
          },
          {
            id: nanoid(),
            profileId: bloqueadoId,
            bloqueadoId: profileId,
            createdAt: ts,
          },
        )
      }
      for (const m of db.matches) {
        const involves =
          (m.profileAId === profileId && m.profileBId === bloqueadoId) ||
          (m.profileAId === bloqueadoId && m.profileBId === profileId)
        if (involves) m.estado = "archivado"
      }
    })
  },
  async report(reporterProfileId, reportadoProfileId, motivo, detalle) {
    mutateDb((db) => {
      db.reportes.push({
        id: nanoid(),
        reporterProfileId,
        reportadoProfileId,
        motivo,
        detalle,
        createdAt: nowIso(),
      })
    })
  },
  async isBlocked(profileId, otherId) {
    return getDb().bloqueos.some(
      (b) => b.profileId === profileId && b.bloqueadoId === otherId,
    )
  },
  async listBlockedIds(profileId) {
    return getDb()
      .bloqueos.filter((b) => b.profileId === profileId)
      .map((b) => b.bloqueadoId)
  },
}

export const mockDataLayer: DataLayer = {
  users,
  profiles,
  matches,
  games,
  messages,
  challenges,
  safety,
}
