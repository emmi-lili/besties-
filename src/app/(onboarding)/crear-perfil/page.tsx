import { PhasePlaceholder } from "@/components/shared/phase-placeholder"
import { LogoutButton } from "@/components/auth/logout-button"

export default function CrearPerfilPage() {
  return (
    <div className="px-4">
      <PhasePlaceholder
        title="Crear perfil"
        phase="Fase 3"
        detail="Wizard de 6 pasos. Ya tenés cuenta y sesión — el perfil se arma acá."
      />
      <div className="mx-auto max-w-md px-1 pb-10">
        <LogoutButton variant="ghost" />
      </div>
    </div>
  )
}
