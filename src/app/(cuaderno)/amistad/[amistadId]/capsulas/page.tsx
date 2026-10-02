import { getAuthContext } from "@/lib/auth/current-user"
import { getDataLayer } from "@/lib/data"
import { CapsulaCard } from "@/components/capsulas/capsula-card"
import { WriteCapsulaSheet } from "@/components/capsulas/write-capsula-sheet"

export default async function CapsulasPage({
  params,
}: {
  params: Promise<{ amistadId: string }>
}) {
  const { amistadId } = await params
  const auth = await getAuthContext()
  const me = auth!.profile!
  const data = getDataLayer()
  const capsulas = await data.capsules.list(amistadId, me.id)

  const emergencia = capsulas.find((c) => c.tipo === "emergencia")
  const resto = capsulas.filter((c) => c.tipo !== "emergencia")
  const archivo = resto.filter((c) => c.desbloqueadaAt)
  const activas = resto.filter((c) => !c.desbloqueadaAt)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-headline-lg">Cápsulas</h1>
        <p className="mt-2 font-sans text-label-md text-on-surface-variant">
          Solo tú y ella pueden ver estos sobres.
        </p>
        {/* TODO: cifrado E2E — cuando exista, cambiar copy a cifrado real */}
      </div>

      <WriteCapsulaSheet amistadId={amistadId} />

      {emergencia ? (
        <CapsulaCard capsula={emergencia} isEmergency />
      ) : null}

      {activas.length === 0 && archivo.length === 0 && !emergencia ? (
        <div className="space-y-3 py-6">
          <p className="font-serif text-body-lg italic text-on-surface-variant">
            Todavía no le escribiste nada a su futuro
          </p>
        </div>
      ) : null}

      <div className="space-y-4">
        {activas.map((c) => (
          <CapsulaCard key={c.id} capsula={c} />
        ))}
      </div>

      {archivo.length > 0 ? (
        <section className="space-y-4 border-t border-outline-variant pt-8">
          <h2 className="font-serif text-headline-sm">Archivo</h2>
          {archivo.map((c) => (
            <CapsulaCard key={c.id} capsula={c} />
          ))}
        </section>
      ) : null}
    </div>
  )
}
