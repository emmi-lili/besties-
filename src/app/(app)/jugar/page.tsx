import { PhasePlaceholder } from "@/components/shared/phase-placeholder"

export default function JugarPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <PhasePlaceholder
        title="Jugar"
        phase="Fase 5–7"
        detail="Hub de juegos, partidas abiertas y reto de la semana."
        icon="rocket"
      />
    </div>
  )
}
