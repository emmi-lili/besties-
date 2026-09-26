import Link from "next/link"
import {
  User,
  Mail,
  Settings,
  Edit3,
  Heart,
  Gamepad2,
  Trophy,
  ChevronRight,
  Sparkles,
} from "lucide-react"
import { LogoutButton } from "@/components/auth/logout-button"
import { getAuthContext } from "@/lib/auth/current-user"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default async function PerfilPage() {
  const auth = await getAuthContext()

  const userInitials = auth?.user.email
    ? auth.user.email.substring(0, 2).toUpperCase()
    : "??"

  const profileName = auth?.profile?.nombre ?? "Usuaria"

  const stats = [
    { label: "Matches", value: "0", icon: Heart },
    { label: "Partidas", value: "0", icon: Gamepad2 },
    { label: "Logros", value: "0", icon: Trophy },
  ]

  const menuItems = [
    {
      href: "/perfil/editar",
      label: "Editar perfil",
      description: "Actualiza tu información",
      icon: Edit3,
    },
    {
      href: "/retos",
      label: "Retos",
      description: "Desafíos semanales",
      icon: Sparkles,
    },
  ]

  return (
    <div className="flex flex-col gap-6 px-4 py-6">
      <div className="animate-fade-in-up rounded-2xl border border-border/60 bg-surface-container-lowest p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="relative">
            <Avatar className="size-20 border-2 border-primary-container shadow-md">
              <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-headline-sm font-display text-on-primary">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <span className="absolute -bottom-1 -right-1 flex size-6 items-center justify-center rounded-full border-2 border-surface-container-lowest bg-secondary shadow-sm">
              <User className="size-3 text-on-secondary" />
            </span>
          </div>

          <div className="flex-1 space-y-1">
            <h1 className="font-display text-headline-md text-ink">
              {profileName}
            </h1>
            {auth?.user.email && (
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Mail className="size-3.5" />
                <p className="text-label-md">{auth.user.email}</p>
              </div>
            )}
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-container/50 px-2.5 py-1 text-label-sm font-medium text-primary">
                <span className="size-1.5 animate-pulse rounded-full bg-primary" />
                Perfil en construcción
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="animate-fade-in-up stagger-1 grid grid-cols-3 gap-3">
        {stats.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="flex flex-col items-center gap-2 rounded-xl border border-border/40 bg-surface-container-lowest/80 p-4 text-center"
          >
            <div className="flex size-10 items-center justify-center rounded-lg bg-surface-container">
              <Icon className="size-5 text-on-surface-variant" strokeWidth={1.8} />
            </div>
            <div>
              <p className="font-display text-headline-sm text-ink">{value}</p>
              <p className="text-label-sm text-muted-foreground">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="animate-fade-in-up stagger-2 space-y-2">
        <h2 className="px-1 text-label-md font-medium text-on-surface-variant">
          Configuración
        </h2>
        <div className="overflow-hidden rounded-xl border border-border/60 bg-surface-container-lowest">
          {menuItems.map(({ href, label, description, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="group flex items-center gap-3 border-b border-border/40 px-4 py-3.5 transition-colors last:border-b-0 hover:bg-surface-container/50"
            >
              <div className="flex size-10 items-center justify-center rounded-lg bg-surface-container transition-colors group-hover:bg-surface-container-high">
                <Icon className="size-5 text-on-surface-variant" strokeWidth={1.8} />
              </div>
              <div className="flex-1">
                <p className="text-body-md font-medium text-ink">{label}</p>
                <p className="text-label-sm text-muted-foreground">{description}</p>
              </div>
              <ChevronRight className="size-5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>
      </div>

      <div className="animate-fade-in-up stagger-3 flex flex-col gap-3 pt-2">
        <Button asChild variant="outline" className="justify-start gap-2">
          <Link href="/perfil/editar">
            <Settings className="size-4" />
            Ajustes de cuenta
          </Link>
        </Button>
        <LogoutButton variant="ghost" />
      </div>
    </div>
  )
}
