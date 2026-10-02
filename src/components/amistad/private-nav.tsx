"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookOpen, Mail, MapPin, Heart } from "lucide-react"
import { cn } from "@/lib/utils"

const ITEMS = [
  { href: "diario", label: "Diario", icon: BookOpen },
  { href: "capsulas", label: "Cápsulas", icon: Mail },
  { href: "lugares", label: "Lugares", icon: MapPin },
  { href: "nosotras", label: "Nosotras", icon: Heart },
] as const

export function PrivateNav({ amistadId }: { amistadId: string }) {
  const pathname = usePathname()
  const base = `/amistad/${amistadId}`

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-outline-variant bg-surface/95 backdrop-blur-sm"
      aria-label="Cuaderno compartido"
    >
      <ul className="mx-auto flex max-w-column items-stretch justify-around px-2 pb-[env(safe-area-inset-bottom)]">
        {ITEMS.map(({ href, label, icon: Icon }) => {
          const path = `${base}/${href}`
          const active = pathname === path || pathname.startsWith(`${path}/`)
          return (
            <li key={href} className="flex-1">
              <Link
                href={path}
                className={cn(
                  "flex flex-col items-center gap-0.5 py-2.5 text-label-sm transition-colors",
                  active ? "text-primary" : "text-on-surface-variant",
                )}
              >
                <Icon className="size-5" strokeWidth={active ? 2.25 : 1.5} />
                <span>{label}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
