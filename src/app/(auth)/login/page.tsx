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
        <h1 className="font-display text-headline-lg text-on-surface">Entrar</h1>
        <p className="text-body-md text-muted-foreground">
          Poné el código para pasar.
        </p>
      </div>

      <LoginForm />
    </div>
  )
}
