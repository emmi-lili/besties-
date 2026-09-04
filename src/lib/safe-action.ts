import { createSafeActionClient } from "next-safe-action"

export const actionClient = createSafeActionClient({
  handleServerError(error) {
    console.error("[action]", error)
    return "Algo salió mal. Probá de nuevo en un momento."
  },
})
