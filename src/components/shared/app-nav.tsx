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
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-paper/95 backdrop-blur-sm md:hidden"
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
                  "flex flex-col items-center gap-0.5 py-2.5 text-micro transition-colors",
                  active ? "text-tomato" : "text-muted-foreground",
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
    <aside className="hidden w-56 shrink-0 border-r border-border bg-paper p-4 md:block">
      <nav aria-label="Navegación principal" className="sticky top-6 space-y-1">
        {ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-body font-medium transition-colors",
                active
                  ? "bg-tomato/10 text-tomato"
                  : "text-ink/70 hover:bg-muted hover:text-ink",
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
