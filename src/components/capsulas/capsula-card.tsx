"use client"

import { useState } from "react"
import { useReducedMotion, motion } from "framer-motion"
import type { Capsula } from "@/lib/data/types-amistad"
import { canOpenSeal } from "@/lib/capsulas/unlock"
import {
  formatDaysUntil,
  formatLongDate,
  progressSince,
} from "@/lib/scrapbook/format"
import { SealButton } from "./seal-button"
import { openCapsulaAction, declareEventAction } from "@/actions/amistad"
import { useAction } from "next-safe-action/hooks"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function CapsulaCard({
  capsula,
  isEmergency,
}: {
  capsula: Capsula
  isEmergency?: boolean
}) {
  const reduceMotion = useReducedMotion()
  const [opened, setOpened] = useState(Boolean(capsula.desbloqueadaAt))
  const [contenido, setContenido] = useState(capsula.contenido)
  const { executeAsync: openAsync } = useAction(openCapsulaAction)
  const { execute: declareEvent, isPending: declaring } =
    useAction(declareEventAction)

  const recordLike = {
    tipo: capsula.tipo,
    condicion: capsula.condicion,
    desbloqueadaAt: opened ? capsula.desbloqueadaAt ?? new Date().toISOString() : null,
  }
  const canOpen = canOpenSeal(recordLike)

  async function handleOpen() {
    const result = await openAsync({ capsulaId: capsula.id })
    if (result?.data?.capsula) {
      setContenido(result.data.capsula.contenido)
      setOpened(true)
    }
  }

  const fechaCond =
    capsula.tipo === "fecha" && capsula.condicion && "fecha" in capsula.condicion
      ? capsula.condicion.fecha
      : null

  if (isEmergency && !opened) {
    return (
      <section className="mb-8 bg-surface-container px-5 py-8">
        <p className="font-sans text-label-sm uppercase tracking-wide text-on-surface-variant">
          Cápsula de emergencia
        </p>
        <h2 className="mt-3 font-serif text-headline-lg italic leading-snug text-on-surface">
          {capsula.titulo}
        </h2>
        <div className="mt-8 flex justify-center">
          <SealButton onComplete={handleOpen} />
        </div>
      </section>
    )
  }

  return (
    <article
      className={cn(
        "rounded-xl bg-surface-container-lowest p-5 shadow-paper-1",
        opened && "shadow-paper-2",
      )}
    >
      <p className="font-sans text-label-sm text-on-surface-variant">
        {capsula.tipo === "fecha" && "Por fecha"}
        {capsula.tipo === "evento" && "Por evento"}
        {capsula.tipo === "necesidad" && "Por necesidad"}
        {capsula.tipo === "emergencia" && "Emergencia"}
        {" · "}
        {formatLongDate(capsula.escritaAt)}
      </p>
      <h3 className="mt-2 font-serif text-headline-sm text-on-surface">
        {capsula.titulo}
      </h3>

      {fechaCond && !opened ? (
        <div className="mt-4 space-y-2">
          <p className="font-serif text-body-md italic text-on-surface-variant">
            Faltan {formatDaysUntil(fechaCond)} días ·{" "}
            {progressSince(capsula.escritaAt, fechaCond)}% recorrido
          </p>
          <div className="h-1.5 overflow-hidden rounded-full bg-surface-container-high">
            <div
              className="h-full bg-primary"
              style={{
                width: `${progressSince(capsula.escritaAt, fechaCond)}%`,
              }}
            />
          </div>
        </div>
      ) : null}

      {capsula.tipo === "evento" &&
      !opened &&
      capsula.condicion &&
      "evento" in capsula.condicion &&
      !capsula.condicion.declarado ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-4"
          disabled={declaring}
          onClick={() => declareEvent({ capsulaId: capsula.id })}
        >
          Ya pasó
        </Button>
      ) : null}

      {!opened && canOpen ? (
        <div className="mt-6 flex justify-center">
          <SealButton onComplete={handleOpen} />
        </div>
      ) : null}

      {!opened && !canOpen && capsula.tipo !== "evento" ? (
        <p className="mt-4 font-sans text-label-md text-on-surface-variant">
          Todavía cerrada.
        </p>
      ) : null}

      {opened && contenido !== null ? (
        <motion.div
          initial={
            reduceMotion
              ? false
              : { clipPath: "inset(0 0 100% 0)", opacity: 1 }
          }
          animate={{ clipPath: "inset(0 0 0% 0)", opacity: 1 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="mt-5 border-t border-outline-variant pt-5"
        >
          <p className="font-serif text-body-lg leading-relaxed whitespace-pre-wrap text-on-surface">
            {contenido}
          </p>
          {capsula.adjuntos.length > 0 ? (
            <ul className="mt-4 flex flex-wrap gap-2">
              {capsula.adjuntos.map((a) => (
                <li
                  key={a.id}
                  className="rounded-sm bg-accent-blush/40 px-2.5 py-1 font-sans text-label-sm text-on-surface"
                  style={{ transform: `rotate(${a.id.length % 3}deg)` }}
                >
                  {a.label}
                </li>
              ))}
            </ul>
          ) : null}
          {capsula.leidaAt ? (
            <p className="mt-4 font-serif text-body-md italic text-on-surface-variant">
              Leída · {formatLongDate(capsula.leidaAt)}
            </p>
          ) : null}
        </motion.div>
      ) : null}

      {/* Chips de adjuntos bloqueados (solo metadata) */}
      {!opened && capsula.adjuntos.length > 0 ? (
        <ul className="mt-4 flex flex-wrap gap-2">
          {capsula.adjuntos.map((a) => (
            <li
              key={a.id}
              className="rounded-sm bg-surface-container px-2.5 py-1 font-sans text-label-sm text-on-surface-variant"
            >
              {a.label}
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  )
}
