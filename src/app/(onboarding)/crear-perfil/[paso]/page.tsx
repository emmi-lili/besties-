import { PhasePlaceholder } from "@/components/shared/phase-placeholder"

export default async function CrearPerfilPasoPage({
  params,
}: {
  params: Promise<{ paso: string }>
}) {
  const { paso } = await params
  return (
    <PhasePlaceholder
      title={`Paso: ${paso}`}
      phase="Fase 3"
      detail="Cada paso del onboarding vive acá."
    />
  )
}
