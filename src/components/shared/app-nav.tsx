"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Compass, MessageCircle, Gamepad2, User, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { APP_NAME } from "@/lib/constants"

const ITEMS = [
  { href: "/descubrir", label: "Descubrir", icon: Compass },
  { href: "/matches", label: "Matches", icon: MessageCircle },
  { href: "/jugar", label: "Jugar", icon: Gamepad2 },
  { href: "/perfil", label: "Perfil", icon: User },
] as const

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-surface/90 backdrop-blur-lg md:hidden"
      aria-label="Navegación principal"
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-around px-2 pb-[env(safe-area-inset-bottom)]">
        {ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`)
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className={cn(
                  "relative flex flex-col items-center gap-1 py-2.5 transition-all duration-200",
                  active
                    ? "text-primary"
                    : "text-muted-foreground hover:text-on-surface",
                )}
              >
                <span
                  className={cn(
                    "relative flex items-center justify-center rounded-xl p-1.5 transition-all duration-200",
                    active && "bg-primary-container",
                  )}
                >
                  <Icon
                    className={cn(
                      "size-5 transition-transform duration-200",
                      active && "scale-105",
                    )}
                    strokeWidth={active ? 2.2 : 1.8}
                  />
                  {active && (
                    <span className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-primary animate-scale-in" />
                  )}
                </span>
                <span
                  className={cn(
                    "text-[0.65rem] font-medium tracking-wide transition-all duration-200",
                    active && "font-semibold",
                  )}
                >
                  {label}
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export function SideNav() {
  const pathname = usePathname()

  return (
    <aside className="hidden w-60 shrink-0 border-r border-border/60 bg-surface-container-lowest p-5 md:block">
      <div className="sticky top-6 space-y-6">
        <Link
          href="/"
          className="group flex items-center gap-2.5 px-2 transition-opacity hover:opacity-80"
        >
          <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-md shadow-primary/20 transition-transform duration-200 group-hover:scale-105">
            <Sparkles className="size-5 text-on-primary" strokeWidth={2} />
          </div>
          <span className="font-display text-title-md tracking-tight text-ink">
            {APP_NAME}
          </span>
        </Link>

        <nav aria-label="Navegación principal" className="space-y-1">
          {ITEMS.map(({ href, label, icon: Icon }, index) => {
            const active = pathname === href || pathname.startsWith(`${href}/`)
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-body-md font-medium transition-all duration-200",
                  active
                    ? "bg-primary-container/60 text-primary shadow-sm"
                    : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface",
                )}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <span
                  className={cn(
                    "flex items-center justify-center rounded-lg p-1 transition-all duration-200",
                    active
                      ? "bg-primary/10"
                      : "bg-surface-container-high group-hover:bg-surface-container-highest",
                  )}
                >
                  <Icon
                    className={cn(
                      "size-[18px] transition-transform duration-200",
                      active && "scale-105",
                    )}
                    strokeWidth={active ? 2.2 : 1.8}
                  />
                </span>
                {label}
                {active && (
                  <span className="absolute right-3 size-1.5 rounded-full bg-primary animate-scale-in" />
                )}
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
