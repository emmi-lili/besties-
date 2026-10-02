"use client"

import { useState } from "react"
import { useAction } from "next-safe-action/hooks"
import { motion, useReducedMotion } from "framer-motion"
import type { EntradaDiario, EstampillaSlug } from "@/lib/data/types-amistad"
import { addStampAction, createDiaryEntryAction } from "@/actions/amistad"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { formatLongDate, formatMonthLabel } from "@/lib/scrapbook/format"
import { cn } from "@/lib/utils"

const STAMPS: { slug: EstampillaSlug; label: string }[] = [
  { slug: "corazon", label: "♡" },
  { slug: "llorar", label: "esto me hizo llorar" },
  { slug: "reir", label: "me reí sola" },
  { slug: "guardado", label: "guardado" },
]

function groupByDay(entries: EntradaDiario[]) {
  const map = new Map<string, EntradaDiario[]>()
  for (const e of entries) {
    const key = e.createdAt.slice(0, 10)
    const list = map.get(key) ?? []
    list.push(e)
    map.set(key, list)
  }
  return [...map.entries()]
}

export function DiaryFeed({
  amistadId,
  myProfileId,
  herProfileId,
  initialEntries,
  year,
  monthIndex,
}: {
  amistadId: string
  myProfileId: string
  herProfileId: string
  initialEntries: EntradaDiario[]
  year: number
  monthIndex: number
}) {
  const reduceMotion = useReducedMotion()
  const [entries, setEntries] = useState(initialEntries)
  const [note, setNote] = useState("")
  const [cursor, setCursor] = useState({ year, monthIndex })
  const { execute: createEntry, isPending } = useAction(createDiaryEntryAction, {
    onSuccess: () => {
      setNote("")
      window.location.reload()
    },
  })
  const { execute: stamp } = useAction(addStampAction, {
    onSuccess: () => window.location.reload(),
  })

  const groups = groupByDay(entries)

  function loadPreviousMonth() {
    let y = cursor.year
    let m = cursor.monthIndex - 1
    if (m < 0) {
      m = 11
      y -= 1
    }
    setCursor({ year: y, monthIndex: m })
    // Navegación simple: query reload
    window.location.href = `/amistad/${amistadId}/diario?y=${y}&m=${m}`
  }

  return (
    <div className="space-y-8">
      <form
        className="space-y-3"
        onSubmit={(e) => {
          e.preventDefault()
          if (!note.trim()) return
          createEntry({
            amistadId,
            tipo: "nota",
            contenido: note.trim(),
          })
        }}
      >
        <Textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Una línea en el cuaderno…"
          className="min-h-24 border-0 border-l-2 border-transparent bg-surface-container-low font-serif text-body-lg focus-visible:border-primary focus-visible:ring-0"
          rows={3}
        />
        <Button type="submit" disabled={isPending || !note.trim()}>
          Guardar en el diario
        </Button>
      </form>

      {groups.length === 0 ? (
        <p className="font-serif text-body-lg italic text-on-surface-variant">
          El cuaderno todavía está en blanco. Escribí la primera línea.
        </p>
      ) : null}

      {groups.map(([day, dayEntries]) => (
        <section key={day} className="space-y-4">
          <h2 className="font-serif text-title-md italic text-on-surface-variant">
            {formatLongDate(day)}
          </h2>
          {dayEntries.map((entry) => {
            const mine = entry.autorProfileId === myProfileId
            return (
              <article
                key={entry.id}
                className="relative rounded-xl bg-surface-container-lowest p-4 shadow-paper-1"
              >
                <div className="flex items-start gap-3">
                  <span
                    className={cn(
                      "mt-1 size-9 shrink-0 rounded-full border-2",
                      mine ? "border-primary bg-primary-container" : "border-secondary bg-secondary-container",
                    )}
                    aria-hidden
                  />
                  <div className="min-w-0 flex-1">
                    {entry.tipo === "foto" && entry.mediaUrl ? (
                      <figure
                        className="mb-3 bg-surface-container-lowest p-2 shadow-paper-2"
                        style={{
                          transform: `rotate(${(entry.id.charCodeAt(0) % 3) - 1}deg)`,
                        }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={entry.mediaUrl}
                          alt=""
                          className="aspect-[4/5] w-full object-cover"
                        />
                        <figcaption className="mt-2 px-1 font-serif text-body-md italic">
                          {entry.contenido}
                        </figcaption>
                      </figure>
                    ) : entry.tipo === "voz" ? (
                      <div className="flex items-center gap-3 rounded-full bg-secondary-container px-4 py-3 text-on-secondary-container">
                        <span className="font-sans text-label-sm">sello de voz</span>
                        <span aria-hidden className="tracking-widest">
                          ▌▌▌▌▌▌
                        </span>
                      </div>
                    ) : (
                      <p className="font-serif text-body-lg leading-relaxed whitespace-pre-wrap">
                        {entry.contenido}
                      </p>
                    )}

                    <div className="relative mt-3 flex flex-wrap gap-2">
                      {entry.estampillas.map((s) => (
                        <motion.span
                          key={s.id}
                          initial={reduceMotion ? false : { scale: 1.4, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="inline-block rounded-sm border border-accent-gold bg-accent-gold/20 px-2 py-0.5 font-sans text-label-sm text-on-surface"
                          style={{ transform: `rotate(${s.rotacion}deg)` }}
                        >
                          {STAMPS.find((x) => x.slug === s.slug)?.label ?? s.slug}
                        </motion.span>
                      ))}
                    </div>

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {STAMPS.map((s) => (
                        <button
                          key={s.slug}
                          type="button"
                          className="rounded-sm px-2 py-1 font-sans text-label-sm text-on-surface-variant hover:bg-surface-container"
                          onClick={() =>
                            stamp({ entradaId: entry.id, slug: s.slug })
                          }
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            )
          })}
        </section>
      ))}

      <Button type="button" variant="outline" className="w-full" onClick={loadPreviousMonth}>
        {formatMonthLabel(
          cursor.monthIndex === 0 ? cursor.year - 1 : cursor.year,
          cursor.monthIndex === 0 ? 11 : cursor.monthIndex - 1,
        )}
      </Button>
      {/* herProfileId reserved for prompts futuros */}
      <span className="sr-only">{herProfileId}</span>
    </div>
  )
}
