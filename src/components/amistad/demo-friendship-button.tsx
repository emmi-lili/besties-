"use client"

import { useAction } from "next-safe-action/hooks"
import { createDemoFriendshipAction } from "@/actions/amistad"
import { Button } from "@/components/ui/button"

/** Solo mock: abre un cuaderno con un perfil seed para probar la mitad privada. */
export function DemoFriendshipButton() {
  const { execute, isPending, result } = useAction(createDemoFriendshipAction)
  return (
    <div className="rounded-xl border border-dashed border-outline-variant p-4">
      <p className="font-serif text-body-md italic text-on-surface-variant">
        Para probar el cuaderno sin pasar por juegos todavía
      </p>
      <Button
        type="button"
        variant="outline"
        className="mt-3"
        disabled={isPending}
        onClick={() => execute()}
      >
        {isPending ? "Abriendo…" : "Abrir cuaderno demo con Ady"}
      </Button>
      {result.serverError ? (
        <p className="mt-2 font-sans text-label-sm text-error">
          {result.serverError}
        </p>
      ) : null}
    </div>
  )
}
