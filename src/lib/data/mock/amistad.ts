import { nanoid } from "nanoid"
import { stableRotation } from "@/lib/scrapbook/format"
import { canOpenSeal } from "@/lib/capsulas/unlock"
import type {
  CapsuleRepository,
  DiaryRepository,
  FriendshipRepository,
  MilestoneRepository,
  PlaceRepository,
} from "../repositories-amistad"
import type {
  Amistad,
  Capsula,
  CapsulaAdjunto,
  CapsulaAdjuntoRecord,
  CapsulaRecord,
  CreateCapsulaInput,
  EntradaDiario,
  Estampilla,
  Hito,
  Lugar,
} from "../types-amistad"
import { getDb, mutateDb } from "./store"

function nowIso() {
  return new Date().toISOString()
}

function pairIds(a: string, b: string): [string, string] {
  return [a, b].sort() as [string, string]
}

function assertMember(amistad: Amistad, profileId: string) {
  if (amistad.profileAId !== profileId && amistad.profileBId !== profileId) {
    throw new Error("No participás de esta amistad")
  }
}

function toPublicCapsula(
  record: CapsulaRecord,
  adjuntos: CapsulaAdjuntoRecord[],
  viewerProfileId: string,
): Capsula {
  const unlocked = Boolean(record.desbloqueadaAt)
  const isParticipant =
    record.autorProfileId === viewerProfileId ||
    record.destinatarioProfileId === viewerProfileId

  if (!isParticipant) {
    throw new Error("Sin acceso a esta cápsula")
  }

  const publicAdjuntos: CapsulaAdjunto[] = adjuntos.map((a) => ({
    id: a.id,
    capsulaId: a.capsulaId,
    tipo: a.tipo,
    url: unlocked ? a.url : null,
    duracionSeg: a.duracionSeg,
    label: a.label,
    metadata: unlocked ? a.metadata : { kind: a.tipo },
  }))

  return {
    id: record.id,
    amistadId: record.amistadId,
    autorProfileId: record.autorProfileId,
    destinatarioProfileId: record.destinatarioProfileId,
    titulo: record.titulo,
    tipo: record.tipo,
    condicion: record.condicion,
    contenido: unlocked ? record.contenido : null,
    escritaAt: record.escritaAt,
    desbloqueadaAt: record.desbloqueadaAt,
    leidaAt: record.leidaAt,
    reaccion: record.reaccion,
    adjuntos: publicAdjuntos,
  }
}

export const friendships: FriendshipRepository = {
  async propose(matchId, fromProfileId) {
    const db = getDb()
    const match = db.matches.find((m) => m.id === matchId)
    if (!match) throw new Error("Match no encontrado")
    if (
      match.profileAId !== fromProfileId &&
      match.profileBId !== fromProfileId
    ) {
      throw new Error("No participás de este match")
    }

    const existing = db.amistades.find((a) => a.matchId === matchId)
    if (existing) return existing

    const [a, b] = pairIds(match.profileAId, match.profileBId)
    let created: Amistad | null = null
    mutateDb((d) => {
      created = {
        id: nanoid(),
        profileAId: a,
        profileBId: b,
        estado: "propuesta",
        propuestaPorId: fromProfileId,
        oficialDesde: null,
        matchId,
        createdAt: nowIso(),
      }
      d.amistades.push(created)
    })
    return created!
  },

  async accept(amistadId, profileId) {
    let updated: Amistad | null = null
    mutateDb((db) => {
      const a = db.amistades.find((x) => x.id === amistadId)
      if (!a) throw new Error("Amistad no encontrada")
      assertMember(a, profileId)
      if (a.propuestaPorId === profileId) {
        throw new Error("La otra tiene que aceptar")
      }
      if (a.estado === "oficial") {
        updated = a
        return
      }
      a.estado = "oficial"
      a.oficialDesde = nowIso()
      updated = a
      db.hitos.push({
        id: nanoid(),
        amistadId: a.id,
        tipo: "oficial",
        payload: {},
        ocurrioAt: a.oficialDesde,
      })
    })
    return updated!
  },

  async decline(amistadId, profileId) {
    mutateDb((db) => {
      const a = db.amistades.find((x) => x.id === amistadId)
      if (!a) return
      assertMember(a, profileId)
      a.estado = "disuelta"
    })
  },

  async getById(amistadId) {
    return getDb().amistades.find((a) => a.id === amistadId) ?? null
  },

  async listForProfile(profileId) {
    return getDb().amistades.filter(
      (a) =>
        (a.profileAId === profileId || a.profileBId === profileId) &&
        a.estado !== "disuelta",
    )
  },

  async getByMatchId(matchId) {
    return getDb().amistades.find((a) => a.matchId === matchId) ?? null
  },

  async createDemoOfficial(profileId) {
    const db = getDb()
    const other = db.profiles.find(
      (p) => p.id !== profileId && p.onboardingCompleto,
    )
    if (!other) throw new Error("No hay perfil seed disponible")

    const existing = db.amistades.find(
      (a) =>
        a.estado === "oficial" &&
        ((a.profileAId === profileId && a.profileBId === other.id) ||
          (a.profileBId === profileId && a.profileAId === other.id)),
    )
    if (existing) return existing

    const [a, b] = pairIds(profileId, other.id)
    let created: Amistad | null = null
    const ts = nowIso()
    mutateDb((d) => {
      let match = d.matches.find(
        (m) =>
          (m.profileAId === a && m.profileBId === b) ||
          (m.profileAId === b && m.profileBId === a),
      )
      if (!match) {
        match = {
          id: nanoid(),
          profileAId: a,
          profileBId: b,
          score: 82,
          razones: ["demo de cuaderno"],
          estado: "chat_desbloqueado",
          createdAt: ts,
        }
        d.matches.push(match)
        d.hitos.push({
          id: nanoid(),
          amistadId: "pending",
          tipo: "match",
          payload: { matchId: match.id },
          ocurrioAt: ts,
        })
      }

      created = {
        id: nanoid(),
        profileAId: a,
        profileBId: b,
        estado: "oficial",
        propuestaPorId: profileId,
        oficialDesde: ts,
        matchId: match.id,
        createdAt: ts,
      }
      d.amistades.push(created)

      // Fix pending hito amistadId
      for (const h of d.hitos) {
        if (h.amistadId === "pending") h.amistadId = created.id
      }
      d.hitos.push({
        id: nanoid(),
        amistadId: created.id,
        tipo: "oficial",
        payload: {},
        ocurrioAt: ts,
      })
    })
    return created!
  },
}

export const capsules: CapsuleRepository = {
  async list(amistadId, viewerProfileId) {
    const db = getDb()
    const amistad = db.amistades.find((a) => a.id === amistadId)
    if (!amistad || amistad.estado !== "oficial") {
      throw new Error("Amistad no oficial")
    }
    assertMember(amistad, viewerProfileId)

    return db.capsulas
      .filter((c) => c.amistadId === amistadId)
      .map((c) =>
        toPublicCapsula(
          c,
          db.capsulaAdjuntos.filter((a) => a.capsulaId === c.id),
          viewerProfileId,
        ),
      )
      .sort((a, b) => b.escritaAt.localeCompare(a.escritaAt))
  },

  async getById(capsulaId, viewerProfileId) {
    const db = getDb()
    const record = db.capsulas.find((c) => c.id === capsulaId)
    if (!record) return null
    return toPublicCapsula(
      record,
      db.capsulaAdjuntos.filter((a) => a.capsulaId === record.id),
      viewerProfileId,
    )
  },

  async create(input: CreateCapsulaInput) {
    const db = getDb()
    const amistad = db.amistades.find((a) => a.id === input.amistadId)
    if (!amistad || amistad.estado !== "oficial") {
      throw new Error("Amistad no oficial")
    }
    assertMember(amistad, input.autorProfileId)

    if (input.tipo === "emergencia") {
      const exists = db.capsulas.some(
        (c) =>
          c.amistadId === input.amistadId &&
          c.autorProfileId === input.autorProfileId &&
          c.tipo === "emergencia",
      )
      if (exists) {
        throw new Error("Ya tenés una cápsula de emergencia en esta amistad")
      }
    }

    let created: CapsulaRecord | null = null
    mutateDb((d) => {
      created = {
        id: nanoid(),
        amistadId: input.amistadId,
        autorProfileId: input.autorProfileId,
        destinatarioProfileId: input.destinatarioProfileId,
        titulo: input.titulo,
        tipo: input.tipo,
        condicion: input.condicion,
        contenido: input.contenido,
        escritaAt: nowIso(),
        desbloqueadaAt: null,
        leidaAt: null,
        reaccion: null,
      }
      d.capsulas.push(created)
      for (const adj of input.adjuntos ?? []) {
        d.capsulaAdjuntos.push({
          id: nanoid(),
          capsulaId: created.id,
          tipo: adj.tipo,
          url: adj.url,
          duracionSeg: adj.duracionSeg ?? null,
          label: adj.label,
          metadata: adj.metadata ?? {},
        })
      }
    })

    return toPublicCapsula(
      created!,
      getDb().capsulaAdjuntos.filter((a) => a.capsulaId === created!.id),
      input.autorProfileId,
    )
  },

  async open(capsulaId, viewerProfileId) {
    let opened: CapsulaRecord | null = null
    mutateDb((db) => {
      const record = db.capsulas.find((c) => c.id === capsulaId)
      if (!record) throw new Error("Cápsula no encontrada")
      if (record.destinatarioProfileId !== viewerProfileId) {
        // Autora puede releer si ya abierta; no abrir sello de la otra
        if (record.autorProfileId === viewerProfileId && record.desbloqueadaAt) {
          opened = record
          return
        }
        if (record.autorProfileId !== viewerProfileId) {
          throw new Error("Esta carta no es para vos")
        }
        throw new Error("Todavía no la abrió ella")
      }
      if (!canOpenSeal(record)) {
        throw new Error("Todavía no se puede abrir")
      }
      if (!record.desbloqueadaAt) {
        record.desbloqueadaAt = nowIso()
        record.leidaAt = record.desbloqueadaAt
        db.hitos.push({
          id: nanoid(),
          amistadId: record.amistadId,
          tipo: "capsula_abierta",
          payload: { capsulaId: record.id, titulo: record.titulo },
          ocurrioAt: record.desbloqueadaAt,
        })
      } else if (!record.leidaAt) {
        record.leidaAt = nowIso()
      }
      opened = record
    })

    return toPublicCapsula(
      opened!,
      getDb().capsulaAdjuntos.filter((a) => a.capsulaId === opened!.id),
      viewerProfileId,
    )
  },

  async declareEvent(capsulaId, profileId) {
    let updated: CapsulaRecord | null = null
    mutateDb((db) => {
      const record = db.capsulas.find((c) => c.id === capsulaId)
      if (!record) throw new Error("Cápsula no encontrada")
      if (record.tipo !== "evento") throw new Error("No es una cápsula por evento")
      if (record.destinatarioProfileId !== profileId) {
        throw new Error("Solo la destinataria declara el evento")
      }
      const cond = record.condicion as { evento: string; declarado?: boolean }
      record.condicion = { ...cond, declarado: true }
      updated = record
    })
    return toPublicCapsula(
      updated!,
      getDb().capsulaAdjuntos.filter((a) => a.capsulaId === updated!.id),
      profileId,
    )
  },

  async setReaction(capsulaId, profileId, reaccion) {
    mutateDb((db) => {
      const record = db.capsulas.find((c) => c.id === capsulaId)
      if (!record || !record.desbloqueadaAt) return
      if (record.destinatarioProfileId !== profileId) return
      record.reaccion = reaccion
    })
  },
}

export const diary: DiaryRepository = {
  async listByMonth(amistadId, year, monthIndex) {
    const db = getDb()
    const start = new Date(year, monthIndex, 1)
    const end = new Date(year, monthIndex + 1, 1)
    return db.entradasDiario
      .filter((e) => {
        if (e.amistadId !== amistadId) return false
        const t = new Date(e.createdAt).getTime()
        return t >= start.getTime() && t < end.getTime()
      })
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .map((e) => ({
        ...e,
        estampillas: db.estampillas.filter((s) => s.entradaId === e.id),
      }))
  },

  async create(input) {
    let entry: Omit<EntradaDiario, "estampillas"> | null = null
    mutateDb((db) => {
      entry = {
        id: nanoid(),
        amistadId: input.amistadId,
        autorProfileId: input.autorProfileId,
        tipo: input.tipo,
        contenido: input.contenido,
        mediaUrl: input.mediaUrl ?? null,
        lugarId: input.lugarId ?? null,
        createdAt: nowIso(),
      }
      db.entradasDiario.push(entry)
    })
    return { ...entry!, estampillas: [] }
  },

  async addStamp(entradaId, autorProfileId, slug) {
    let stamp: Estampilla | null = null
    mutateDb((db) => {
      const existing = db.estampillas.find(
        (s) => s.entradaId === entradaId && s.autorProfileId === autorProfileId,
      )
      if (existing) {
        existing.slug = slug
        stamp = existing
        return
      }
      stamp = {
        id: nanoid(),
        entradaId,
        autorProfileId,
        slug,
        rotacion: stableRotation(`${entradaId}-${autorProfileId}-${slug}`, 2),
      }
      db.estampillas.push(stamp)
    })
    return stamp!
  },
}

export const places: PlaceRepository = {
  async list(amistadId) {
    return getDb().lugares.filter((l) => l.amistadId === amistadId)
  },

  async create(input) {
    let lugar: Lugar | null = null
    mutateDb((db) => {
      lugar = {
        id: nanoid(),
        amistadId: input.amistadId,
        nombre: input.nombre,
        ciudad: input.ciudad,
        lat: input.lat ?? null,
        lng: input.lng ?? null,
        estado: input.estado ?? "pendiente",
        visitadoAt: input.estado === "visitado" ? nowIso() : null,
        propuestoPorId: input.propuestoPorId,
        fotoUrl: input.fotoUrl ?? null,
        linea: input.linea ?? null,
      }
      db.lugares.push(lugar)
    })
    return lugar!
  },

  async markVisited(lugarId, profileId, fotoUrl) {
    let lugar: Lugar | null = null
    const ts = nowIso()
    mutateDb((db) => {
      const l = db.lugares.find((x) => x.id === lugarId)
      if (!l) throw new Error("Lugar no encontrado")
      l.estado = "visitado"
      l.visitadoAt = ts
      if (fotoUrl) l.fotoUrl = fotoUrl
      lugar = l
      db.hitos.push({
        id: nanoid(),
        amistadId: l.amistadId,
        tipo: "lugar_nuevo",
        payload: { lugarId: l.id, nombre: l.nombre },
        ocurrioAt: ts,
      })
      db.entradasDiario.push({
        id: nanoid(),
        amistadId: l.amistadId,
        autorProfileId: profileId,
        tipo: "foto",
        contenido: `Fuimos a ${l.nombre}.`,
        mediaUrl: fotoUrl ?? null,
        lugarId: l.id,
        createdAt: ts,
      })
    })
    return lugar!
  },
}

export const milestones: MilestoneRepository = {
  async list(amistadId) {
    return getDb()
      .hitos.filter((h) => h.amistadId === amistadId)
      .sort((a, b) => a.ocurrioAt.localeCompare(b.ocurrioAt))
  },

  async add(input) {
    let hito: Hito | null = null
    mutateDb((db) => {
      hito = { ...input, id: nanoid() }
      db.hitos.push(hito)
    })
    return hito!
  },
}
