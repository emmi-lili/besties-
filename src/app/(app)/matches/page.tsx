import Link from "next/link"
import { getAuthContext } from "@/lib/auth/current-user"
import { getDataLayer } from "@/lib/data"
import { DemoFriendshipButton } from "@/components/amistad/demo-friendship-button"
import { FriendshipActions } from "@/components/amistad/friendship-actions"

export default async function MatchesPage() {
  const auth = await getAuthContext()
  const me = auth!.profile!
  const data = getDataLayer()
  const matches = await data.matches.listMatches(me.id)
  const amistades = await data.friendships.listForProfile(me.id)
  const oficiales = amistades.filter((a) => a.estado === "oficial")
  const propuestas = amistades.filter((a) => a.estado === "propuesta")

  const oficialRows = await Promise.all(
    oficiales.map(async (a) => {
      const otherId = a.profileAId === me.id ? a.profileBId : a.profileAId
      const other = await data.profiles.getById(otherId)
      return { a, other }
    }),
  )

  const matchRows = await Promise.all(
    matches.map(async (m) => {
      const otherId = m.profileAId === me.id ? m.profileBId : m.profileAId
      const other = await data.profiles.getById(otherId)
      const amistad = await data.friendships.getByMatchId(m.id)
      return { m, other, amistad }
    }),
  )

  return (
    <div className="space-y-8 px-4 py-6">
      <div>
        <h1 className="font-serif text-headline-lg">Matches</h1>
        <p className="mt-1 font-sans text-label-md text-on-surface-variant">
          Jugando ahora y amistades que ya son cuaderno.
        </p>
      </div>

      {oficialRows.length > 0 ? (
        <section className="space-y-3">
          <h2 className="font-serif text-headline-sm">Cuadernos</h2>
          <ul className="space-y-2">
            {oficialRows.map(({ a, other }) => (
              <li key={a.id}>
                <Link
                  href={`/amistad/${a.id}/diario`}
                  className="flex items-center justify-between rounded-lg bg-surface-container-lowest px-4 py-3 shadow-paper-1"
                >
                  <span className="font-serif text-title-md">
                    {other?.nombre ?? "Amiga"}
                  </span>
                  <span className="font-sans text-label-sm text-primary">
                    Abrir cuaderno
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {propuestas.length > 0 ? (
        <section className="space-y-3">
          <h2 className="font-serif text-headline-sm">Pendientes</h2>
          {propuestas.map((a) => (
            <div
              key={a.id}
              className="rounded-lg bg-surface-container-lowest px-4 py-3 shadow-paper-1"
            >
              <FriendshipActions
                amistadId={a.id}
                iProposed={a.propuestaPorId === me.id}
              />
            </div>
          ))}
        </section>
      ) : null}

      <section className="space-y-3">
        <h2 className="font-serif text-headline-sm">Matches</h2>
        {matchRows.length === 0 ? (
          <p className="font-serif text-body-md italic text-on-surface-variant">
            Todavía no hay matches. El feed llega completo en la siguiente fase
            de juegos.
          </p>
        ) : (
          <ul className="space-y-2">
            {matchRows.map(({ m, other, amistad }) => (
              <li
                key={m.id}
                className="flex items-center justify-between gap-3 rounded-lg bg-surface-container-lowest px-4 py-3 shadow-paper-1"
              >
                <div>
                  <p className="font-serif text-title-md">
                    {other?.nombre ?? "Match"}
                  </p>
                  <p className="font-sans text-label-sm text-on-surface-variant">
                    {m.estado}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Link
                    href={`/chat/${m.id}`}
                    className="font-sans text-label-sm text-primary"
                  >
                    Chat
                  </Link>
                  {!amistad ? (
                    <FriendshipActions matchId={m.id} mode="propose" />
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <DemoFriendshipButton />
    </div>
  )
}
