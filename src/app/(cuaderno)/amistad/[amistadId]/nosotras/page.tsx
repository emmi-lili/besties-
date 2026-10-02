import { getAuthContext } from "@/lib/auth/current-user"
import { getDataLayer } from "@/lib/data"
import { NosotrasView } from "@/components/amistad/nosotras-view"

export default async function NosotrasPage({
  params,
}: {
  params: Promise<{ amistadId: string }>
}) {
  const { amistadId } = await params
  const auth = await getAuthContext()
  const me = auth!.profile!
  const data = getDataLayer()
  const amistad = (await data.friendships.getById(amistadId))!
  const herId =
    amistad.profileAId === me.id ? amistad.profileBId : amistad.profileAId
  const her = (await data.profiles.getById(herId))!
  const hitos = await data.milestones.list(amistadId)
  const insignias = await data.insignias.listAll()
  const insigniasUsuario = await data.insignias.listForProfile(me.id)

  return (
    <NosotrasView
      amistad={amistad}
      me={me}
      her={her}
      hitos={hitos}
      insignias={insignias}
      insigniasUsuario={insigniasUsuario}
    />
  )
}
