import { redirect } from "next/navigation"
import { APP_NAME } from "@/lib/constants"
import { getAuthContext, hasCompleteProfile } from "@/lib/auth/current-user"
import Link from "next/link"

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const auth = await getAuthContext()
  if (!auth) redirect("/login")
  if (hasCompleteProfile(auth.profile)) redirect("/descubrir")

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="px-5 pt-6">
        <Link href="/" className="font-display text-h3 tracking-tight text-ink">
          {APP_NAME}
        </Link>
      </header>
      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  )
}
