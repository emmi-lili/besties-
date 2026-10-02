"use client"

import { useState } from "react"
import { useAction } from "next-safe-action/hooks"
import type { Lugar } from "@/lib/data/types-amistad"
import {
  createPlaceAction,
  markPlaceVisitedAction,
} from "@/actions/amistad"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export function PlacesView({
  amistadId,
  lugares,
}: {
  amistadId: string
  lugares: Lugar[]
}) {
  const [mode, setMode] = useState<"mapa" | "lista">("lista")
  const [nombre, setNombre] = useState("")
  const [ciudad, setCiudad] = useState("")
  const { execute: createPlace, isPending } = useAction(createPlaceAction, {
    onSuccess: () => {
      setNombre("")
      setCiudad("")
      window.location.reload()
    },
  })
  const { execute: markVisited } = useAction(markPlaceVisitedAction, {
    onSuccess: () => window.location.reload(),
  })

  const byCity = new Map<string, Lugar[]>()
  for (const l of lugares) {
    const list = byCity.get(l.ciudad) ?? []
    list.push(l)
    byCity.set(l.ciudad, list)
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <Button
          type="button"
          size="sm"
          variant={mode === "lista" ? "default" : "outline"}
          onClick={() => setMode("lista")}
        >
          Lista
        </Button>
        <Button
          type="button"
          size="sm"
          variant={mode === "mapa" ? "default" : "outline"}
          onClick={() => setMode("mapa")}
        >
          Mapa
        </Button>
      </div>

      {mode === "mapa" ? (
        <div
          className="relative aspect-[4/5] overflow-hidden rounded-xl shadow-paper-2"
          style={{
            background:
              "linear-gradient(160deg, color-mix(in srgb, var(--surface-container) 80%, var(--accent-gold)), color-mix(in srgb, var(--secondary-container) 70%, var(--surface)))",
            filter: "sepia(0.25) saturate(0.75)",
          }}
        >
          <p className="absolute left-4 top-4 font-sans text-label-sm text-on-surface">
            Mapa de la amistad
          </p>
          {lugares.map((l, i) => (
            <span
              key={l.id}
              title={l.nombre}
              className={cn(
                "absolute size-3 rounded-full",
                l.estado === "visitado"
                  ? "bg-primary"
                  : "border border-dashed border-secondary bg-secondary/30",
              )}
              style={{
                left: `${20 + ((i * 17) % 60)}%`,
                top: `${25 + ((i * 23) % 50)}%`,
              }}
            />
          ))}
          {lugares.length === 0 ? (
            <p className="absolute inset-x-6 bottom-8 font-serif text-body-md italic text-on-surface">
              El mapa arranca en el primer lugar donde se vean.
            </p>
          ) : null}
        </div>
      ) : (
        <div className="space-y-6">
          {lugares.length === 0 ? (
            <p className="font-serif text-body-lg italic text-on-surface-variant">
              El mapa arranca en el primer lugar donde se vean.
            </p>
          ) : null}
          {[...byCity.entries()].map(([city, list]) => (
            <section key={city}>
              <h2 className="font-serif text-headline-sm text-on-surface">
                {city}
              </h2>
              <ul className="mt-3 space-y-3">
                {list.map((l) => (
                  <li
                    key={l.id}
                    className="flex items-start justify-between gap-3 rounded-lg bg-surface-container-lowest p-4 shadow-paper-1"
                  >
                    <div>
                      <p className="font-serif text-title-md">{l.nombre}</p>
                      <p className="font-sans text-label-sm text-on-surface-variant">
                        {l.estado === "visitado" ? "Visitado" : "Quieren ir"}
                        {l.linea ? ` · ${l.linea}` : ""}
                      </p>
                    </div>
                    {l.estado === "pendiente" ? (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => markVisited({ lugarId: l.id })}
                      >
                        Fuimos
                      </Button>
                    ) : null}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}

      <form
        className="space-y-3 border-t border-outline-variant pt-6"
        onSubmit={(e) => {
          e.preventDefault()
          createPlace({
            amistadId,
            nombre,
            ciudad,
            estado: "pendiente",
          })
        }}
      >
        <p className="font-sans text-label-md text-on-surface-variant">
          Proponer un lugar
        </p>
        <div className="space-y-2">
          <Label htmlFor="lugar">Nombre</Label>
          <Input
            id="lugar"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="h-11"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ciudad">Ciudad</Label>
          <Input
            id="ciudad"
            value={ciudad}
            onChange={(e) => setCiudad(e.target.value)}
            className="h-11"
            required
          />
        </div>
        <Button type="submit" disabled={isPending}>
          Agregar
        </Button>
      </form>
    </div>
  )
}
