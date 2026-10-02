import { notFound, redirect } from "next/navigation"
import { PrivateNav } from "@/components/amistad/private-nav"
import { getAuthContext, hasCompleteProfile } from "@/lib/auth/current-user"
import { getDataLayer } from "@/lib/data"
import Link from "next/link"

export default async function AmistadLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ amistadId: string }>
}) {
  const { amistadId } = await params
  const auth = await getAuthContext()
  if (!auth?.profile) redirect("/login")
  if (!hasCompleteProfile(auth.profile)) redirect("/crear-perfil")

  const data = getDataLayer()
  const amistad = await data.friendships.getById(amistadId)
  if (!amistad || amistad.estado !== "oficial") notFound()
  if (
    amistad.profileAId !== auth.profile.id &&
    amistad.profileBId !== auth.profile.id
  ) {
    notFound()
  }

  const otherId =
    amistad.profileAId === auth.profile.id
      ? amistad.profileBId
      : amistad.profileAId
  const other = await data.profiles.getById(otherId)

  return (
    <div className="flex min-h-full flex-1 flex-col bg-surface">
      <header className="mx-auto flex w-full max-w-column items-center justify-between px-5 pt-5">
        <Link
          href="/matches"
          className="font-sans text-label-md text-on-surface-variant"
        >
          ← Matches
        </Link>
        <p className="font-serif text-title-md text-on-surface">
          {other?.nombre ?? "Nosotras"}
        </p>
        <span className="w-14" />
      </header>
      <main className="mx-auto w-full max-w-column flex-1 px-5 pb-24 pt-4 md:max-w-[920px] md:px-8">
        <div className="md:mx-auto md:grid md:max-w-[880px] md:grid-cols-2 md:gap-8">
          <div className="md:max-w-notebook-page">{children}</div>
          <div className="hidden md:block md:max-w-notebook-page md:border-l md:border-outline-variant md:pl-8">
            <p className="font-serif text-body-md italic text-on-surface-variant">
              Cuaderno de dos páginas. En móvil se lee una a la vez.
            </p>
          </div>
        </div>
      </main>
      <PrivateNav amistadId={amistadId} />
    </div>
  )
}
