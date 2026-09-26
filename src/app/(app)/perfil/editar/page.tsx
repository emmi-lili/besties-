import { PhasePlaceholder } from "@/components/shared/phase-placeholder"

export default function EditarPerfilPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <PhasePlaceholder
        title="Editar perfil"
        phase="Fase 3"
        detail="Edición de los campos del onboarding."
        icon="construction"
      />
    </div>
  )
}
