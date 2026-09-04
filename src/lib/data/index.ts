import { DATA_SOURCE } from "@/lib/constants"
import type { DataLayer } from "./repositories"
import { mockDataLayer } from "./mock"
import { supabaseDataLayer } from "./supabase"

/**
 * Único punto de acceso a datos.
 * Pages, components y actions importan desde aquí — nunca desde mock/ directo.
 */
export function getDataLayer(): DataLayer {
  if (DATA_SOURCE === "supabase") {
    return supabaseDataLayer
  }
  return mockDataLayer
}

export type { DataLayer } from "./repositories"
export type * from "./types"
