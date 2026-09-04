import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs"
import path from "node:path"
import { DB_STORAGE_KEY } from "@/lib/constants"
import type { MockDatabase } from "../types"
import { seed } from "./seed"

const GLOBAL_KEY = "__amiguis_mock_db__" as const
const FILE_PATH = path.join(process.cwd(), ".data", "amiguis-db.json")

type GlobalWithDb = typeof globalThis & {
  [GLOBAL_KEY]?: MockDatabase
}

function cloneDb(db: MockDatabase): MockDatabase {
  return structuredClone(db)
}

function readLocalStorage(): MockDatabase | null {
  if (typeof window === "undefined") return null
  try {
    const raw = window.localStorage.getItem(DB_STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as MockDatabase
  } catch {
    return null
  }
}

function writeLocalStorage(db: MockDatabase): void {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(db))
  } catch {
    // Quota o modo privado — el store en memoria sigue vivo.
  }
}

function readFileDb(): MockDatabase | null {
  if (typeof window !== "undefined") return null
  try {
    if (!existsSync(FILE_PATH)) return null
    const raw = readFileSync(FILE_PATH, "utf8")
    return JSON.parse(raw) as MockDatabase
  } catch {
    return null
  }
}

function writeFileDb(db: MockDatabase): void {
  if (typeof window !== "undefined") return
  try {
    mkdirSync(path.dirname(FILE_PATH), { recursive: true })
    writeFileSync(FILE_PATH, JSON.stringify(db), "utf8")
  } catch {
    // Entorno sin FS writable — memoria alcanza para la request.
  }
}

function migrateDb(db: MockDatabase): MockDatabase {
  return {
    ...db,
    amistades: db.amistades ?? [],
    capsulas: db.capsulas ?? [],
    capsulaAdjuntos: db.capsulaAdjuntos ?? [],
    entradasDiario: db.entradasDiario ?? [],
    estampillas: db.estampillas ?? [],
    lugares: db.lugares ?? [],
    hitos: db.hitos ?? [],
  }
}

/** Obtiene (o crea con seed) la DB mock. */
export function getDb(): MockDatabase {
  const g = globalThis as GlobalWithDb

  if (typeof window !== "undefined") {
    const fromLs = readLocalStorage()
    if (fromLs) {
      const migrated = migrateDb(fromLs)
      g[GLOBAL_KEY] = migrated
      return migrated
    }
  }

  if (!g[GLOBAL_KEY]) {
    const fromFile = readFileDb()
    g[GLOBAL_KEY] = migrateDb(fromFile ?? seed())
    writeLocalStorage(g[GLOBAL_KEY])
    if (!fromFile) writeFileDb(g[GLOBAL_KEY])
  } else {
    g[GLOBAL_KEY] = migrateDb(g[GLOBAL_KEY])
  }

  return g[GLOBAL_KEY]
}

export function saveDb(db: MockDatabase): void {
  const g = globalThis as GlobalWithDb
  g[GLOBAL_KEY] = db
  writeLocalStorage(db)
  writeFileDb(db)
}

export function mutateDb(mutator: (db: MockDatabase) => void): MockDatabase {
  const db = cloneDb(getDb())
  mutator(db)
  saveDb(db)
  return db
}

export function resetDb(): MockDatabase {
  const fresh = seed()
  saveDb(fresh)
  return fresh
}

/** Expone el seed para tests y scripts. */
export { seed }
