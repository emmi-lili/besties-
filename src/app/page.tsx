import Link from "next/link"
import { APP_NAME } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import { LandingDemo } from "@/components/shared/landing-demo"

export default function LandingPage() {
  return (
    <main className="relative flex min-h-full flex-1 flex-col overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,#f2c14e33,transparent_50%),radial-gradient(ellipse_at_90%_20%,#e4572e22,transparent_45%),radial-gradient(ellipse_at_50%_100%,#2d6a4f18,transparent_40%)]"
      />
      <div className="relative mx-auto flex w-full max-w-lg flex-1 flex-col justify-between px-5 pb-10 pt-8">
        <header className="flex items-center justify-between">
          <p className="font-display text-h3 tracking-tight text-ink">
            {APP_NAME}
          </p>
          <Button asChild variant="ghost" size="sm">
            <Link href="/login">Entrar</Link>
          </Button>
        </header>

        <div className="flex flex-1 flex-col justify-center gap-8 py-10">
          <div className="space-y-3">
            <h1 className="font-display text-display leading-[1.05] text-ink">
              Hacer amigas de grande es rarísimo. Acá no.
            </h1>
            <p className="max-w-sm text-body text-muted-foreground">
              No matcheás mirando una foto. Matcheás jugando.
            </p>
          </div>

          <LandingDemo />
        </div>

        <p className="text-center text-micro text-muted-foreground">
          Respondé y arrancá. Sin cuenta no hay match.
        </p>
      </div>
    </main>
  )
}
