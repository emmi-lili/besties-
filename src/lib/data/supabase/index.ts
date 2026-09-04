import type { DataLayer } from "../repositories"

function notImplemented(method: string): never {
  throw new Error(
    `[supabase] ${method} no implementado. Cambiá NEXT_PUBLIC_DATA_SOURCE a "mock" o implementá la capa Supabase.`,
  )
}

function stubRepo<T extends object>(name: string): T {
  return new Proxy(
    {},
    {
      get(_target, prop) {
        if (typeof prop === "symbol") return undefined
        return () => notImplemented(`${name}.${String(prop)}`)
      },
    },
  ) as T
}

/** Stubs de fase 2 — rompen en runtime, no en tipos. */
export const supabaseDataLayer: DataLayer = {
  users: stubRepo("users"),
  profiles: stubRepo("profiles"),
  matches: stubRepo("matches"),
  games: stubRepo("games"),
  messages: stubRepo("messages"),
  challenges: stubRepo("challenges"),
  safety: stubRepo("safety"),
}
