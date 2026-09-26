import { PhasePlaceholder } from "@/components/shared/phase-placeholder"

export default function MatchesPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <PhasePlaceholder
        title="Matches"
        phase="Fase 6"
        detail="Jugando ahora + Tus amiguis, con estado de turno y mensajes."
        icon="sparkles"
      />
    </div>
  )
}
