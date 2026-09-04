/** Rotación estable ±maxDeg a partir de un id (polaroids / estampillas). */
export function stableRotation(id: string, maxDeg = 1.5): number {
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) | 0
  }
  const t = (Math.abs(hash) % 10000) / 10000
  return (t * 2 - 1) * maxDeg
}

export function formatDaysUntil(targetIso: string, now = new Date()): number {
  const target = new Date(targetIso)
  const ms = target.getTime() - now.getTime()
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)))
}

export function progressSince(
  writtenIso: string,
  targetIso: string,
  now = new Date(),
): number {
  const start = new Date(writtenIso).getTime()
  const end = new Date(targetIso).getTime()
  if (end <= start) return 100
  const pct = ((now.getTime() - start) / (end - start)) * 100
  return Math.min(100, Math.max(0, Math.round(pct)))
}

export function daysBetween(fromIso: string, to = new Date()): number {
  const from = new Date(fromIso).getTime()
  return Math.max(0, Math.floor((to.getTime() - from) / (1000 * 60 * 60 * 24)))
}

const MONTHS_ES = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
]

export function formatMonthLabel(year: number, monthIndex: number): string {
  return `${MONTHS_ES[monthIndex]} ${year}`
}

export function formatLongDate(iso: string): string {
  const d = new Date(iso)
  return `${d.getDate()} de ${MONTHS_ES[d.getMonth()]} de ${d.getFullYear()}`
}
