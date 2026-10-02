import { redirect } from "next/navigation"
import {
  getAuthContext,
  hasCompleteProfile,
} from "@/lib/auth/current-user"

export default async function CuadernoRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const auth = await getAuthContext()
  if (!auth) redirect("/login")
  if (!hasCompleteProfile(auth.profile)) redirect("/crear-perfil")
  return children
}
