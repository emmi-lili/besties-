import { redirect } from "next/navigation"
import { BottomNav, SideNav } from "@/components/shared/app-nav"
import {
  getAuthContext,
  hasCompleteProfile,
} from "@/lib/auth/current-user"

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const auth = await getAuthContext()
  if (!auth) redirect("/login")
  if (!hasCompleteProfile(auth.profile)) redirect("/crear-perfil")

  return (
    <div className="flex min-h-full flex-1">
      <SideNav />
      <div className="flex min-w-0 flex-1 flex-col pb-20 md:pb-0">
        <main className="mx-auto w-full max-w-lg flex-1 md:max-w-2xl">
          {children}
        </main>
        <BottomNav />
      </div>
    </div>
  )
}
