import Link from "next/link"
import { notFound } from "next/navigation"
import { getAuthContext } from "@/lib/auth/current-user"
import { getDataLayer } from "@/lib/data"
import { FriendshipActions } from "@/components/amistad/friendship-actions"

export default async function ChatPage({
  params,
}: {
  params: Promise<{ matchId: string }>
}) {
  const { matchId } = await params
  const auth = await getAuthContext()
  const me = auth!.profile!
  const data = getDataLayer()
  const match = await data.matches.getMatch(matchId)
  if (!match) notFound()
  if (match.profileAId !== me.id && match.profileBId !== me.id) notFound()

  const otherId =
    match.profileAId === me.id ? match.profileBId : match.profileAId
  const other = await data.profiles.getById(otherId)
  const amistad = await data.friendships.getByMatchId(matchId)
  const messages = await data.messages.list(matchId)

  return (
    <div className="flex min-h-full flex-col px-4 py-6">
      <header className="mb-6 flex items-center justify-between">
        <Link
          href="/matches"
          className="font-sans text-label-md text-on-surface-variant"
        >
          ← Matches
        </Link>
        <h1 className="font-serif text-headline-sm">
          {other?.nombre ?? "Chat"}
        </h1>
        <span className="w-14" />
      </header>

      {amistad?.estado === "oficial" ? (
        <Link
          href={`/amistad/${amistad.id}/diario`}
          className="mb-6 block rounded-xl bg-surface-container px-4 py-3 font-serif text-body-md italic text-on-surface shadow-paper-1"
        >
          Ya son oficiales. Abrir el cuaderno →
        </Link>
      ) : amistad?.estado === "propuesta" ? (
        <div className="mb-6 rounded-xl bg-surface-container px-4 py-3 shadow-paper-1">
          <FriendshipActions
            amistadId={amistad.id}
            iProposed={amistad.propuestaPorId === me.id}
          />
        </div>
      ) : (
        <div className="mb-6 space-y-2 rounded-xl border border-outline-variant px-4 py-4">
          <p className="font-serif text-body-md italic text-on-surface-variant">
            Cuando sientan que ya son amigas de verdad
          </p>
          <FriendshipActions matchId={matchId} mode="propose" />
        </div>
      )}

      <div className="flex-1 space-y-3">
        {messages.length === 0 ? (
          <p className="font-serif text-body-md italic text-on-surface-variant">
            El chat se llena después del primer juego. Por ahora, el gesto que
            importa es hacerlo oficial.
          </p>
        ) : (
          messages.map((m) => (
            <p
              key={m.id}
              className="rounded-lg bg-surface-container-lowest px-3 py-2 font-serif text-body-md shadow-paper-1"
            >
              {m.contenido}
            </p>
          ))
        )}
      </div>
    </div>
  )
}
