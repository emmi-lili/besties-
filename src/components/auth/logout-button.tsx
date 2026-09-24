"use client"

import { useAction } from "next-safe-action/hooks"
import { LogOut, Loader2 } from "lucide-react"
import { logoutAction } from "@/actions/auth"
import { Button } from "@/components/ui/button"

export function LogoutButton({
  variant = "outline",
}: {
  variant?: "outline" | "ghost" | "destructive"
}) {
  const { execute, isPending } = useAction(logoutAction)

  return (
    <Button
      type="button"
      variant={variant}
      disabled={isPending}
      onClick={() => execute()}
      className="gap-2"
    >
      {isPending ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          Saliendo…
        </>
      ) : (
        <>
          <LogOut className="size-4" />
          Cerrar sesión
        </>
      )}
    </Button>
  )
}
