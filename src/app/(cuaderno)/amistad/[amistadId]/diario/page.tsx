import { getAuthContext } from "@/lib/auth/current-user"
import { getDataLayer } from "@/lib/data"
import { DiaryFeed } from "@/components/diario/diary-feed"

export default async function DiarioPage({
  params,
  searchParams,
}: {
  params: Promise<{ amistadId: string }>
  searchParams: Promise<{ y?: string; m?: string }>
}) {
  const { amistadId } = await params
  const sp = await searchParams
  const auth = await getAuthContext()
  const me = auth!.profile!
  const data = getDataLayer()
  const amistad = (await data.friendships.getById(amistadId))!
  const herId =
    amistad.profileAId === me.id ? amistad.profileBId : amistad.profileAId

  const now = new Date()
  const year = sp.y ? Number(sp.y) : now.getFullYear()
  const monthIndex = sp.m !== undefined ? Number(sp.m) : now.getMonth()

  const entries = await data.diary.listByMonth(amistadId, year, monthIndex)

  return (
    <div>
      <h1 className="mb-6 font-serif text-headline-lg">Diario</h1>
      <p className="mb-6 font-sans text-label-md text-on-surface-variant">
        Solo tú y ella pueden ver estas páginas.
      </p>
      <DiaryFeed
        amistadId={amistadId}
        myProfileId={me.id}
        herProfileId={herId}
        initialEntries={entries}
        year={year}
        monthIndex={monthIndex}
      />
    </div>
  )
}
