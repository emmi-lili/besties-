"use client"

import { useAction } from "next-safe-action/hooks"
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
    >
      {isPending ? "Saliendo…" : "Cerrar sesión"}
    </Button>
  )
}
