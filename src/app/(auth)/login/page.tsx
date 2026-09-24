import Link from "next/link"
import { redirect } from "next/navigation"
import { Sparkles, Heart } from "lucide-react"
import { LoginForm } from "@/components/auth/login-form"
import {
  getAuthContext,
  hasCompleteProfile,
} from "@/lib/auth/current-user"
import { APP_NAME } from "@/lib/constants"

export default async function LoginPage() {
  const auth = await getAuthContext()
  if (auth) {
    redirect(hasCompleteProfile(auth.profile) ? "/descubrir" : "/crear-perfil")
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-5 py-10">
      <div className="mb-10 space-y-4">
        <div className="animate-fade-in-down flex items-center gap-2">
          <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-md shadow-primary/20">
            <Sparkles className="size-5 text-on-primary" strokeWidth={2} />
          </div>
          <span className="font-display text-title-md tracking-tight text-ink">
            {APP_NAME}
          </span>
        </div>

        <div className="animate-fade-in-up stagger-1 space-y-2 pt-2">
          <h1 className="font-display text-headline-lg text-ink">
            Bienvenida de vuelta
          </h1>
          <p className="flex items-center gap-1.5 text-body-md text-muted-foreground">
            <Heart className="size-4 text-primary/60" />
            Tu círculo te espera. O al menos el feed.
          </p>
        </div>
      </div>

      <div className="animate-fade-in-up stagger-2 rounded-2xl border border-border/60 bg-surface-container-lowest p-6 shadow-sm">
        <LoginForm />
      </div>

      <p className="animate-fade-in mt-8 text-center text-label-md text-muted-foreground">
        ¿Primera vez?{" "}
        <Link
          href="/registro"
          className="font-medium text-primary underline-offset-2 transition-colors hover:text-primary/80 hover:underline"
        >
          Creá tu cuenta
        </Link>
      </p>
    </div>
  )
}
