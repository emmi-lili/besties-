import { PhasePlaceholder } from "@/components/shared/phase-placeholder"
import { LogoutButton } from "@/components/auth/logout-button"
import { getAuthContext } from "@/lib/auth/current-user"

export default async function PerfilPage() {
  const auth = await getAuthContext()

  return (
    <div className="px-4 py-6">
      <PhasePlaceholder
        title="Tu perfil"
        phase="Fase 3+"
        detail={
          auth
            ? `Sesión activa: ${auth.user.email}. El preview completo llega con el onboarding.`
            : "Sin sesión."
        }
      />
      <div className="mt-4">
        <LogoutButton />
      </div>
    </div>
  )
}
