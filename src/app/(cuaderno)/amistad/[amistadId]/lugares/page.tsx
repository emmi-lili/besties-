import { getAuthContext } from "@/lib/auth/current-user"
import { getDataLayer } from "@/lib/data"
import { PlacesView } from "@/components/amistad/places-view"

export default async function LugaresPage({
  params,
}: {
  params: Promise<{ amistadId: string }>
}) {
  const { amistadId } = await params
  const auth = await getAuthContext()
  void auth
  const data = getDataLayer()
  const lugares = await data.places.list(amistadId)

  return (
    <div>
      <h1 className="mb-6 font-serif text-headline-lg">Lugares</h1>
      <PlacesView amistadId={amistadId} lugares={lugares} />
    </div>
  )
}
