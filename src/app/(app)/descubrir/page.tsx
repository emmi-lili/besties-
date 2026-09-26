import { PhasePlaceholder } from "@/components/shared/phase-placeholder"

export default function DescubrirPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <PhasePlaceholder
        title="Descubrir"
        phase="Fase 4"
        detail="Feed con score, razón y swipe. El seed de 12 perfiles ya está en el mock."
        icon="sparkles"
      />
    </div>
  )
}
