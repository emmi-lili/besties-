import { PhasePlaceholder } from "@/components/shared/phase-placeholder"

const STEP_TITLES: Record<string, string> = {
  basicos: "Datos básicos",
  fotos: "Tus fotos",
  intereses: "Tus intereses",
  verdades: "Dos verdades y una mentira",
  "esto-o-esto": "Esto o Esto",
  energia: "Tu energía",
}

export default async function CrearPerfilPasoPage({
  params,
}: {
  params: Promise<{ paso: string }>
}) {
  const { paso } = await params
  const title = STEP_TITLES[paso] ?? `Paso: ${paso}`

  return (
    <PhasePlaceholder
      title={title}
      phase="Fase 3"
      detail="Cada paso del onboarding vive acá."
      icon="construction"
    />
  )
}
