import { z } from "zod"

export const capsulaTipoSchema = z.enum([
  "fecha",
  "evento",
  "necesidad",
  "emergencia",
])

export const createCapsulaSchema = z
  .object({
    amistadId: z.string().min(1),
    titulo: z.string().min(8).max(120),
    tipo: capsulaTipoSchema,
    contenido: z.string().min(1).max(8000),
    fecha: z.string().optional(),
    evento: z.string().optional(),
    adjuntoLabels: z.array(z.string()).max(6).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.tipo === "fecha" && !data.fecha) {
      ctx.addIssue({
        code: "custom",
        message: "Elegí una fecha",
        path: ["fecha"],
      })
    }
    if (data.tipo === "evento" && !data.evento?.trim()) {
      ctx.addIssue({
        code: "custom",
        message: "Escribí el evento",
        path: ["evento"],
      })
    }
  })

export const diaryEntrySchema = z.object({
  amistadId: z.string().min(1),
  tipo: z.enum(["nota", "foto", "voz", "pensamiento"]),
  contenido: z.string().min(1).max(4000),
  mediaUrl: z.string().optional(),
})

export const placeSchema = z.object({
  amistadId: z.string().min(1),
  nombre: z.string().min(2).max(80),
  ciudad: z.string().min(2).max(80),
  estado: z.enum(["visitado", "pendiente"]).optional(),
  linea: z.string().max(200).optional(),
})
