import Link from "next/link"
import { redirect } from "next/navigation"
import { LoginForm } from "@/components/auth/login-form"
import {
  getAuthContext,
  hasCompleteProfile,
} from "@/lib/auth/current-user"

export default async function LoginPage() {
  const auth = await getAuthContext()
  if (auth) {
    redirect(hasCompleteProfile(auth.profile) ? "/descubrir" : "/crear-perfil")
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-5 py-10">
      <div className="mb-8 space-y-2">
        <h1 className="font-display text-h1 text-ink">Entrar</h1>
        <p className="text-body text-muted-foreground">
          Tu círculo te espera. O al menos el feed.
        </p>
      </div>

      <LoginForm />

      <p className="mt-8 text-center text-caption text-muted-foreground">
        ¿Primera vez?{" "}
        <Link
          href="/registro"
          className="font-medium text-tomato underline-offset-2 hover:underline"
        >
          Creá tu cuenta
        </Link>
      </p>
    </div>
  )
}
