"use server"

import { redirect } from "next/navigation"
import { returnServerError } from "next-safe-action"
import { z } from "zod"
import { actionClient } from "@/lib/safe-action"
import { getAuthContext, hasCompleteProfile } from "@/lib/auth/current-user"
import { getDataLayer } from "@/lib/data"
import {
  createCapsulaSchema,
  diaryEntrySchema,
  placeSchema,
} from "@/lib/validations/amistad"
import type { CapsulaCondicion } from "@/lib/data/types-amistad"

async function requireOfficialMember(amistadId: string) {
  const auth = await getAuthContext()
  if (!auth?.profile) returnServerError("Tenés que iniciar sesión")
  if (!hasCompleteProfile(auth.profile)) {
    returnServerError("Completá tu perfil primero")
  }
  const data = getDataLayer()
  const amistad = await data.friendships.getById(amistadId)
  if (!amistad || amistad.estado !== "oficial") {
    returnServerError("Esta amistad no está oficial")
  }
  if (
    amistad.profileAId !== auth.profile.id &&
    amistad.profileBId !== auth.profile.id
  ) {
    returnServerError("No participás de esta amistad")
  }
  return { auth, amistad, data, profileId: auth.profile.id }
}

export const proposeFriendshipAction = actionClient
  .inputSchema(z.object({ matchId: z.string().min(1) }))
  .action(async ({ parsedInput }) => {
    const auth = await getAuthContext()
    if (!auth?.profile) returnServerError("Tenés que iniciar sesión")
    const data = getDataLayer()
    const amistad = await data.friendships.propose(
      parsedInput.matchId,
      auth.profile.id,
    )
    return { amistadId: amistad.id, estado: amistad.estado }
  })

export const acceptFriendshipAction = actionClient
  .inputSchema(z.object({ amistadId: z.string().min(1) }))
  .action(async ({ parsedInput }) => {
    const auth = await getAuthContext()
    if (!auth?.profile) returnServerError("Tenés que iniciar sesión")
    const data = getDataLayer()
    const amistad = await data.friendships.accept(
      parsedInput.amistadId,
      auth.profile.id,
    )
    redirect(`/amistad/${amistad.id}/nosotras`)
  })

export const createDemoFriendshipAction = actionClient.action(async () => {
  const auth = await getAuthContext()
  if (!auth?.profile) returnServerError("Tenés que iniciar sesión")
  if (!hasCompleteProfile(auth.profile)) {
    returnServerError("Completá tu perfil primero")
  }
  const data = getDataLayer()
  const amistad = await data.friendships.createDemoOfficial(auth.profile.id)
  redirect(`/amistad/${amistad.id}/diario`)
})

export const createCapsulaAction = actionClient
  .inputSchema(createCapsulaSchema)
  .action(async ({ parsedInput }) => {
    const { amistad, data, profileId } = await requireOfficialMember(
      parsedInput.amistadId,
    )
    const otherId =
      amistad.profileAId === profileId
        ? amistad.profileBId
        : amistad.profileAId

    let condicion: CapsulaCondicion = null
    if (parsedInput.tipo === "fecha") {
      condicion = { fecha: parsedInput.fecha! }
    } else if (parsedInput.tipo === "evento") {
      condicion = { evento: parsedInput.evento!.trim(), declarado: false }
    }

    const capsula = await data.capsules.create({
      amistadId: parsedInput.amistadId,
      autorProfileId: profileId,
      destinatarioProfileId: otherId,
      titulo: parsedInput.titulo,
      tipo: parsedInput.tipo,
      condicion,
      contenido: parsedInput.contenido,
      adjuntos: (parsedInput.adjuntoLabels ?? []).map((label, i) => {
        const match = label.match(/\((\d+):(\d+)\)/)
        const duracionSeg = match
          ? Number(match[1]) * 60 + Number(match[2])
          : null
        return {
          tipo: label.toLowerCase().includes("audio")
            ? ("audio" as const)
            : ("foto" as const),
          url: `mock://adjunto/${i}`,
          duracionSeg,
          label,
        }
      }),
    })

    return { capsulaId: capsula.id }
  })

export const openCapsulaAction = actionClient
  .inputSchema(z.object({ capsulaId: z.string().min(1) }))
  .action(async ({ parsedInput }) => {
    const auth = await getAuthContext()
    if (!auth?.profile) returnServerError("Tenés que iniciar sesión")
    const data = getDataLayer()
    try {
      const capsula = await data.capsules.open(
        parsedInput.capsulaId,
        auth.profile.id,
      )
      return { capsula }
    } catch (e) {
      returnServerError(
        e instanceof Error ? e.message : "No se pudo abrir la cápsula",
      )
    }
  })

export const declareEventAction = actionClient
  .inputSchema(z.object({ capsulaId: z.string().min(1) }))
  .action(async ({ parsedInput }) => {
    const auth = await getAuthContext()
    if (!auth?.profile) returnServerError("Tenés que iniciar sesión")
    const data = getDataLayer()
    const capsula = await data.capsules.declareEvent(
      parsedInput.capsulaId,
      auth.profile.id,
    )
    return { capsulaId: capsula.id }
  })

export const createDiaryEntryAction = actionClient
  .inputSchema(diaryEntrySchema)
  .action(async ({ parsedInput }) => {
    const { data, profileId } = await requireOfficialMember(
      parsedInput.amistadId,
    )
    const entry = await data.diary.create({
      amistadId: parsedInput.amistadId,
      autorProfileId: profileId,
      tipo: parsedInput.tipo,
      contenido: parsedInput.contenido,
      mediaUrl: parsedInput.mediaUrl,
    })
    return { entryId: entry.id }
  })

export const addStampAction = actionClient
  .inputSchema(
    z.object({
      entradaId: z.string().min(1),
      slug: z.enum(["corazon", "llorar", "reir", "guardado"]),
    }),
  )
  .action(async ({ parsedInput }) => {
    const auth = await getAuthContext()
    if (!auth?.profile) returnServerError("Tenés que iniciar sesión")
    const data = getDataLayer()
    const stamp = await data.diary.addStamp(
      parsedInput.entradaId,
      auth.profile.id,
      parsedInput.slug,
    )
    return { stamp }
  })

export const createPlaceAction = actionClient
  .inputSchema(placeSchema)
  .action(async ({ parsedInput }) => {
    const { data, profileId } = await requireOfficialMember(
      parsedInput.amistadId,
    )
    const lugar = await data.places.create({
      amistadId: parsedInput.amistadId,
      nombre: parsedInput.nombre,
      ciudad: parsedInput.ciudad,
      propuestoPorId: profileId,
      estado: parsedInput.estado ?? "pendiente",
      linea: parsedInput.linea,
    })
    return { lugarId: lugar.id }
  })

export const markPlaceVisitedAction = actionClient
  .inputSchema(z.object({ lugarId: z.string().min(1) }))
  .action(async ({ parsedInput }) => {
    const auth = await getAuthContext()
    if (!auth?.profile) returnServerError("Tenés que iniciar sesión")
    const data = getDataLayer()
    const lugar = await data.places.markVisited(
      parsedInput.lugarId,
      auth.profile.id,
    )
    return { lugarId: lugar.id }
  })

/** Puente hasta el wizard de fase 3: perfil mínimo completo. */
export const completeMinimalProfileAction = actionClient
  .inputSchema(
    z.object({
      nombre: z.string().min(2).max(40),
      edad: z.coerce.number().int().min(20).max(40),
      ciudad: z.string().min(2),
      barrio: z.string().min(2),
    }),
  )
  .action(async ({ parsedInput }) => {
    const auth = await getAuthContext()
    if (!auth) returnServerError("Tenés que iniciar sesión")
    const data = getDataLayer()
    await data.profiles.upsert(auth.user.id, {
      ...parsedInput,
      bio: "",
      fotos: [],
      energiaSocial: 50,
      disponibilidad: ["findes"],
      interesIds: ["i-cafe", "i-leer", "i-caminar"],
      onboardingCompleto: true,
    })
    redirect("/matches")
  })
