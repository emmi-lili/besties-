import { getDataLayer } from "@/lib/data"
import { destroySession, getSession } from "@/lib/auth/session"
import type { Profile, User } from "@/lib/data/types"

export type AuthContext = {
  user: User
  profile: Profile | null
}

export async function getAuthContext(): Promise<AuthContext | null> {
  const session = await getSession()
  if (!session) return null

  const data = getDataLayer()
  const user = await data.users.findById(session.userId)
  if (!user) {
    // Cookie huérfana (mock reiniciado, etc.)
    await destroySession()
    return null
  }

  const profile = await data.profiles.getByUserId(user.id)
  return { user, profile }
}

export function hasCompleteProfile(profile: Profile | null): boolean {
  return Boolean(profile?.onboardingCompleto)
}
