import Link from "next/link"
import { Sparkles, ArrowRight, Heart, Users, Gamepad2 } from "lucide-react"
import { APP_NAME } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import { LandingDemo } from "@/components/shared/landing-demo"

export default function LandingPage() {
  return (
    <main className="relative flex min-h-full flex-1 flex-col overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,#ffd9e440,transparent_50%),radial-gradient(ellipse_at_90%_20%,#e8b49b30,transparent_45%),radial-gradient(ellipse_at_50%_100%,#e0e8d428,transparent_40%)]"
      />

      <div className="relative mx-auto flex w-full max-w-lg flex-1 flex-col justify-between px-5 pb-10 pt-8">
        <header className="flex items-center justify-between animate-fade-in-down">
          <Link href="/" className="group flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80 shadow-md shadow-primary/20 transition-transform duration-200 group-hover:scale-105">
              <Sparkles className="size-4 text-on-primary" strokeWidth={2.5} />
            </div>
            <span className="font-display text-title-md tracking-tight text-ink">
              {APP_NAME}
            </span>
          </Link>
          <Button asChild variant="ghost" size="sm" className="group">
            <Link href="/login">
              Entrar
              <ArrowRight className="ml-1 size-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Button>
        </header>

        <div className="flex flex-1 flex-col justify-center gap-10 py-10">
          <div className="space-y-4">
            <div className="animate-fade-in-up inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-container/30 px-3 py-1">
              <Heart className="size-3.5 text-primary" />
              <span className="text-label-sm font-medium text-primary">
                App de besties ADY Y EMMI
              </span>
            </div>
            <h1 className="animate-fade-in-up stagger-1 font-display text-display-lg leading-[1.05] tracking-tight text-ink text-balance">
              Bienvenidas, besties.{" "}
              <span className="text-primary">Esta app es nuestra 💕</span>
            </h1>
            <p className="animate-fade-in-up stagger-2 max-w-sm text-body-lg text-muted-foreground text-pretty">
              Un espacio para conectar, jugar y ser nosotras mismas.
            </p>
          </div>

          <div className="animate-fade-in-up stagger-3">
            <LandingDemo />
          </div>

          <div className="animate-fade-in-up stagger-4 flex items-center justify-center gap-6 pt-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="flex size-8 items-center justify-center rounded-lg bg-secondary-container/60">
                <Users className="size-4 text-secondary" />
              </div>
              <span className="text-label-md">Besties forever</span>
            </div>
            <div className="h-4 w-px bg-outline-variant" />
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="flex size-8 items-center justify-center rounded-lg bg-tertiary-container/60">
                <Gamepad2 className="size-4 text-tertiary" />
              </div>
              <span className="text-label-md">Diversión juntas</span>
            </div>
          </div>
        </div>

        <p className="animate-fade-in text-center text-label-sm text-muted-foreground">
          Hecho con amor para las mejores besties ✨
        </p>
      </div>
    </main>
  )
}
