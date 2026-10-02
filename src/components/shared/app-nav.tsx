"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Compass, MessageCircle, Gamepad2, User } from "lucide-react"
import { cn } from "@/lib/utils"

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
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 backdrop-blur-sm md:hidden"
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
                  "flex flex-col items-center gap-0.5 py-2.5 text-label-sm transition-colors",
                  active ? "text-primary" : "text-muted-foreground",
                )}
              >
                <Icon className="size-5" strokeWidth={active ? 2.5 : 2} />
                <span className="font-medium">{label}</span>
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
    <aside className="hidden w-56 shrink-0 border-r border-border bg-surface p-4 md:block">
      <nav aria-label="Navegación principal" className="sticky top-6 space-y-1">
        {ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-body-md font-medium transition-colors",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-on-surface/70 hover:bg-muted hover:text-on-surface",
              )}
            >
              <Icon className="size-5" />
              {label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
