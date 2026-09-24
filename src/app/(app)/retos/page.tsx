import { PhasePlaceholder } from "@/components/shared/phase-placeholder"

export default function RetosPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <PhasePlaceholder
        title="Retos"
        phase="Fase 7"
        detail="Reto semanal, participantes y galería de pruebas."
        icon="rocket"
      />
    </div>
  )
}
