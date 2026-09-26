import { PhasePlaceholder } from "@/components/shared/phase-placeholder"
import { LogoutButton } from "@/components/auth/logout-button"

export default function CrearPerfilPage() {
  return (
    <div className="flex flex-1 flex-col px-4">
      <div className="flex-1">
        <PhasePlaceholder
          title="Crear perfil"
          phase="Fase 3"
          detail="Wizard de 6 pasos. Ya tenés cuenta y sesión — el perfil se arma acá."
          icon="rocket"
        />
      </div>
      <div className="mx-auto w-full max-w-md animate-fade-in px-1 pb-10">
        <LogoutButton variant="ghost" />
      </div>
    </div>
  )
}
