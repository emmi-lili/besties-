import { describe, expect, it, beforeEach } from "vitest"
import { resetDb } from "@/lib/data/mock/store"
import { capsules, friendships } from "@/lib/data/mock/amistad"
import { getDb } from "@/lib/data/mock/store"

describe("cápsulas — contenido protegido", () => {
  beforeEach(() => {
    resetDb()
  })

  it("lista no expone contenido de cápsula con fecha futura", async () => {
    const db = getDb()
    const a = db.profiles[0]!
    const b = db.profiles[1]!
    const amistad = await friendships.createDemoOfficial(a.id)

    const future = new Date()
    future.setFullYear(future.getFullYear() + 1)

    await capsules.create({
      amistadId: amistad.id,
      autorProfileId: a.id,
      destinatarioProfileId: b.id,
      titulo: "Abrir cuando cumplamos diez años",
      tipo: "fecha",
      condicion: { fecha: future.toISOString() },
      contenido: "SECRETO_QUE_NO_DEBE_SALIR",
    })

    const listed = await capsules.list(amistad.id, b.id)
    expect(listed).toHaveLength(1)
    expect(listed[0]!.contenido).toBeNull()
    expect(JSON.stringify(listed)).not.toContain("SECRETO_QUE_NO_DEBE_SALIR")

    const byId = await capsules.getById(listed[0]!.id, b.id)
    expect(byId!.contenido).toBeNull()
  })

  it("open entrega contenido solo cuando la condición se cumple", async () => {
    const db = getDb()
    const a = db.profiles[0]!
    const b = db.profiles[1]!
    const amistad = await friendships.createDemoOfficial(a.id)

    const past = new Date()
    past.setDate(past.getDate() - 1)

    const created = await capsules.create({
      amistadId: amistad.id,
      autorProfileId: a.id,
      destinatarioProfileId: b.id,
      titulo: "Abrir cuando leas esto",
      tipo: "fecha",
      condicion: { fecha: past.toISOString() },
      contenido: "Hola del pasado",
    })

    expect(created.contenido).toBeNull()

    const opened = await capsules.open(created.id, b.id)
    expect(opened.contenido).toBe("Hola del pasado")
    expect(opened.desbloqueadaAt).not.toBeNull()
  })
})
