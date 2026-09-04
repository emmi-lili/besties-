import type { CapsulaCondicion, CapsulaRecord, CapsulaTipo } from "@/lib/data/types-amistad"

export function isCapsulaUnlocked(
  record: Pick<CapsulaRecord, "tipo" | "condicion" | "desbloqueadaAt">,
  now = new Date(),
): boolean {
  if (record.desbloqueadaAt) return true

  switch (record.tipo as CapsulaTipo) {
    case "necesidad":
    case "emergencia":
      // Disponibles, pero el contenido solo se entrega al abrir (sello).
      // Hasta desbloqueadaAt, listado sigue con contenido null.
      return false
    case "fecha": {
      const cond = record.condicion as { fecha: string } | null
      if (!cond?.fecha) return false
      return now.getTime() >= new Date(cond.fecha).getTime()
    }
    case "evento": {
      const cond = record.condicion as { evento: string; declarado?: boolean } | null
      return Boolean(cond?.declarado)
    }
    default:
      return false
  }
}

/** Condición cumplida (puede abrir con sello). Distinto de ya leída. */
export function canOpenSeal(
  record: Pick<CapsulaRecord, "tipo" | "condicion" | "desbloqueadaAt">,
  now = new Date(),
): boolean {
  if (record.desbloqueadaAt) return true

  if (record.tipo === "necesidad" || record.tipo === "emergencia") {
    return true
  }
  if (record.tipo === "fecha") {
    const cond = record.condicion as { fecha: string } | null
    if (!cond?.fecha) return false
    return now.getTime() >= new Date(cond.fecha).getTime()
  }
  if (record.tipo === "evento") {
    const cond = record.condicion as { evento: string; declarado?: boolean } | null
    return Boolean(cond?.declarado)
  }
  return false
}

export function tituloPrefix(tipo: CapsulaTipo): string {
  if (tipo === "evento") return "Abrir después de"
  return "Abrir cuando"
}

export type CondicionInput = CapsulaCondicion
