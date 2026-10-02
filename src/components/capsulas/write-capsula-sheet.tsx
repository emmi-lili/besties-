"use client"

import { useState } from "react"
import { useAction } from "next-safe-action/hooks"
import { createCapsulaAction } from "@/actions/amistad"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import type { CapsulaTipo } from "@/lib/data/types-amistad"
import { tituloPrefix } from "@/lib/capsulas/unlock"
import { cn } from "@/lib/utils"

const EVENT_SUGGESTIONS = [
  "tu primera entrevista de trabajo",
  "el día que renuncies",
  "cuando te mudes",
  "cuando te rompan el corazón",
  "el día de tu boda",
  "cuando cumplamos diez años de amigas",
]

type Step = 1 | 2 | 3 | 4

export function WriteCapsulaSheet({ amistadId }: { amistadId: string }) {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<Step>(1)
  const [tipo, setTipo] = useState<CapsulaTipo>("fecha")
  const [fecha, setFecha] = useState("")
  const [evento, setEvento] = useState("")
  const [tituloTail, setTituloTail] = useState("")
  const [contenido, setContenido] = useState("")
  const [adjuntos, setAdjuntos] = useState<string[]>([])

  const { execute, isPending, result } = useAction(createCapsulaAction, {
    onSuccess: () => {
      setOpen(false)
      reset()
      window.location.reload()
    },
  })

  function reset() {
    setStep(1)
    setTipo("fecha")
    setFecha("")
    setEvento("")
    setTituloTail("")
    setContenido("")
    setAdjuntos([])
  }

  const prefix = tituloPrefix(tipo)
  const titulo = `${prefix} ${tituloTail}`.trim()

  function addShortcut(months: number) {
    const d = new Date()
    d.setMonth(d.getMonth() + months)
    setFecha(d.toISOString().slice(0, 10))
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(v) => {
        setOpen(v)
        if (!v) reset()
      }}
    >
      <SheetTrigger asChild>
        <Button className="w-full">Escribir una cápsula</Button>
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="mx-auto max-h-[92vh] max-w-column overflow-y-auto rounded-t-2xl"
      >
        <SheetHeader>
          <SheetTitle className="font-serif text-headline-sm">
            Nueva cápsula
          </SheetTitle>
        </SheetHeader>

        <div className="mt-4 space-y-5 pb-8">
          {step === 1 ? (
            <div className="space-y-3">
              <p className="font-sans text-label-md text-on-surface-variant">
                ¿Cuándo se abre?
              </p>
              {(
                [
                  ["fecha", "Por fecha"],
                  ["evento", "Por evento"],
                  ["necesidad", "Por necesidad"],
                  ["emergencia", "Emergencia (una sola)"],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setTipo(value)}
                  className={cn(
                    "w-full rounded-lg border px-4 py-3 text-left font-sans text-body-md",
                    tipo === value
                      ? "border-primary bg-primary-container text-on-primary-container"
                      : "border-outline-variant bg-surface-container-lowest",
                  )}
                >
                  {label}
                </button>
              ))}
              {tipo === "fecha" ? (
                <div className="space-y-2 pt-2">
                  <Label htmlFor="fecha">Fecha</Label>
                  <Input
                    id="fecha"
                    type="date"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    className="h-11"
                  />
                  <div className="flex flex-wrap gap-2">
                    {[
                      [6, "en 6 meses"],
                      [12, "en un año"],
                      [60, "en 5 años"],
                    ].map(([m, label]) => (
                      <Button
                        key={String(m)}
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => addShortcut(Number(m))}
                      >
                        {label}
                      </Button>
                    ))}
                  </div>
                </div>
              ) : null}
              {tipo === "evento" ? (
                <div className="space-y-2 pt-2">
                  <Label htmlFor="evento">Evento</Label>
                  <Input
                    id="evento"
                    value={evento}
                    onChange={(e) => setEvento(e.target.value)}
                    className="h-11"
                    placeholder="tu primera entrevista…"
                  />
                  <div className="flex flex-wrap gap-2">
                    {EVENT_SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        type="button"
                        className="rounded-full border border-outline-variant px-3 py-1 font-sans text-label-sm text-on-surface-variant"
                        onClick={() => setEvento(s)}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
              <Button
                type="button"
                className="w-full"
                onClick={() => setStep(2)}
                disabled={
                  (tipo === "fecha" && !fecha) ||
                  (tipo === "evento" && !evento.trim())
                }
              >
                Siguiente
              </Button>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="space-y-3">
              <Label htmlFor="titulo">Título</Label>
              <p className="font-serif text-body-md italic text-on-surface-variant">
                {prefix}…
              </p>
              <Input
                id="titulo"
                value={tituloTail}
                onChange={(e) => setTituloTail(e.target.value)}
                className="h-11"
                placeholder={
                  tipo === "evento"
                    ? "de tu primera entrevista"
                    : "necesites una carcajada urgente"
                }
              />
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => setStep(1)}>
                  Atrás
                </Button>
                <Button
                  type="button"
                  className="flex-1"
                  disabled={tituloTail.trim().length < 3}
                  onClick={() => setStep(3)}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="space-y-3">
              <Label htmlFor="contenido">La carta</Label>
              <Textarea
                id="contenido"
                value={contenido}
                onChange={(e) => setContenido(e.target.value)}
                rows={8}
                className={cn(
                  "min-h-40 resize-none border-0 border-l-2 border-transparent bg-surface-container-low font-serif text-body-lg shadow-none",
                  "focus-visible:border-primary focus-visible:ring-0",
                )}
                placeholder="Escribí directo sobre el papel…"
              />
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setAdjuntos((a) => [...a, "Audio secreto (1:45)"])
                  }
                >
                  + Audio
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setAdjuntos((a) => [...a, "3 fotos vergonzosas (2018)"])
                  }
                >
                  + Fotos
                </Button>
              </div>
              {adjuntos.length > 0 ? (
                <ul className="flex flex-wrap gap-2">
                  {adjuntos.map((label) => (
                    <li
                      key={label}
                      className="bg-accent-blush/50 px-2.5 py-1 font-sans text-label-sm"
                    >
                      {label}
                    </li>
                  ))}
                </ul>
              ) : null}
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => setStep(2)}>
                  Atrás
                </Button>
                <Button
                  type="button"
                  className="flex-1"
                  disabled={!contenido.trim()}
                  onClick={() => setStep(4)}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          ) : null}

          {step === 4 ? (
            <div className="space-y-4">
              <div className="rounded-xl border border-outline-variant bg-surface-container-low p-5 shadow-paper-1">
                <p className="font-sans text-label-sm text-on-surface-variant">
                  Así la va a ver ella
                </p>
                <p className="mt-3 font-serif text-headline-sm">{titulo}</p>
                {fecha ? (
                  <p className="mt-2 font-serif text-body-md italic text-on-surface-variant">
                    Se abre el {fecha}
                  </p>
                ) : null}
              </div>
              <p className="font-sans text-label-md text-on-surface-variant">
                Después de sellarla no se puede editar ni borrar. Solo podés
                cancelar ahora.
              </p>
              {result.serverError ? (
                <p className="text-label-md text-error" role="alert">
                  {result.serverError}
                </p>
              ) : null}
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => setStep(3)}>
                  Atrás
                </Button>
                <Button
                  type="button"
                  className="flex-1"
                  disabled={isPending}
                  onClick={() =>
                    execute({
                      amistadId,
                      titulo,
                      tipo,
                      contenido,
                      fecha: fecha || undefined,
                      evento: evento || undefined,
                      adjuntoLabels: adjuntos,
                    })
                  }
                >
                  {isPending ? "Sellando…" : "Sellar y enviar"}
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  )
}
