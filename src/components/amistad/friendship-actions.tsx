"use client"

import { useAction } from "next-safe-action/hooks"
import {
  acceptFriendshipAction,
  proposeFriendshipAction,
} from "@/actions/amistad"
import { Button } from "@/components/ui/button"

export function FriendshipActions({
  matchId,
  amistadId,
  iProposed,
  mode = "accept",
}: {
  matchId?: string
  amistadId?: string
  iProposed?: boolean
  mode?: "propose" | "accept"
}) {
  const { execute: propose, isPending: proposing } = useAction(
    proposeFriendshipAction,
  )
  const { execute: accept, isPending: accepting } = useAction(
    acceptFriendshipAction,
  )

  if (mode === "propose" && matchId) {
    return (
      <Button
        type="button"
        size="sm"
        onClick={() => propose({ matchId })}
        disabled={proposing}
      >
        Hacerlo oficial
      </Button>
    )
  }

  if (amistadId && iProposed) {
    return (
      <p className="font-sans text-label-md text-on-surface-variant">
        Esperando que acepte
      </p>
    )
  }

  if (amistadId) {
    return (
      <Button
        type="button"
        onClick={() => accept({ amistadId })}
        disabled={accepting}
      >
        Aceptar amistad
      </Button>
    )
  }

  return null
}
