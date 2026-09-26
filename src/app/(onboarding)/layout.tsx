import { redirect } from "next/navigation"
import { Sparkles } from "lucide-react"
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
    <div className="relative flex min-h-full flex-1 flex-col overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_10%,#ffd9e425,transparent_50%),radial-gradient(ellipse_at_70%_90%,#e0e8d420,transparent_50%),radial-gradient(ellipse_at_90%_30%,#f5dfc418,transparent_40%)]"
      />
      <header className="relative animate-fade-in-down px-5 pt-6">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80 shadow-md shadow-primary/20 transition-transform duration-200 group-hover:scale-105">
            <Sparkles className="size-4 text-on-primary" strokeWidth={2.5} />
          </div>
          <span className="font-display text-title-md tracking-tight text-ink">
            {APP_NAME}
          </span>
        </Link>
      </header>
      <div className="relative flex flex-1 flex-col">{children}</div>
    </div>
  )
}
