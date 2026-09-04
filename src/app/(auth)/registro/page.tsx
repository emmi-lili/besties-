import Link from "next/link"
import { redirect } from "next/navigation"
import { RegisterForm } from "@/components/auth/register-form"
import {
  getAuthContext,
  hasCompleteProfile,
} from "@/lib/auth/current-user"

export default async function RegistroPage() {
  const auth = await getAuthContext()
  if (auth) {
    redirect(hasCompleteProfile(auth.profile) ? "/descubrir" : "/crear-perfil")
  }
  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-5 py-10">
      <div className="mb-8 space-y-2">
        <h1 className="font-display text-h1 text-ink">Creá tu cuenta</h1>
        <p className="text-body text-muted-foreground">
          Primero la cuenta. Después armamos tu perfil jugando.
        </p>
      </div>

      <RegisterForm />

      <p className="mt-8 text-center text-caption text-muted-foreground">
        ¿Ya tenés cuenta?{" "}
        <Link
          href="/login"
          className="font-medium text-tomato underline-offset-2 hover:underline"
        >
          Iniciá sesión
        </Link>
      </p>
    </div>
  )
}
