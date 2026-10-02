"use client"

import { useAction } from "next-safe-action/hooks"
import { completeMinimalProfileAction } from "@/actions/amistad"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LogoutButton } from "@/components/auth/logout-button"

/** Puente hasta el wizard de 6 pasos (fase 3 del primer prompt). */
export default function CrearPerfilPage() {
  const { execute, isPending, result } = useAction(completeMinimalProfileAction)

  return (
    <div className="mx-auto w-full max-w-md px-5 py-10">
      <h1 className="font-serif text-headline-lg text-on-surface">
        Tu perfil, en corto
      </h1>
      <p className="mt-2 font-sans text-body-md text-on-surface-variant">
        El wizard completo de 6 pasos llega después. Con esto ya podés entrar al
        feed y al cuaderno.
      </p>

      <form
        className="mt-8 space-y-4"
        onSubmit={(e) => {
          e.preventDefault()
          const fd = new FormData(e.currentTarget)
          execute({
            nombre: String(fd.get("nombre") ?? ""),
            edad: Number(fd.get("edad")),
            ciudad: String(fd.get("ciudad") ?? ""),
            barrio: String(fd.get("barrio") ?? ""),
          })
        }}
      >
        <div className="space-y-2">
          <Label htmlFor="nombre">Nombre</Label>
          <Input id="nombre" name="nombre" required className="h-11" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edad">Edad</Label>
          <Input
            id="edad"
            name="edad"
            type="number"
            min={20}
            max={40}
            required
            className="h-11"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ciudad">Ciudad</Label>
          <Input
            id="ciudad"
            name="ciudad"
            defaultValue="La Paz"
            required
            className="h-11"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="barrio">Barrio</Label>
          <Input id="barrio" name="barrio" required className="h-11" />
        </div>
        {result.serverError ? (
          <p className="font-sans text-label-md text-error" role="alert">
            {result.serverError}
          </p>
        ) : null}
        <Button type="submit" className="h-11 w-full" disabled={isPending}>
          {isPending ? "Guardando…" : "Seguir"}
        </Button>
      </form>

      <div className="mt-8">
        <LogoutButton variant="ghost" />
      </div>
    </div>
  )
}
