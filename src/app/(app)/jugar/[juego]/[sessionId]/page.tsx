import { PhasePlaceholder } from "@/components/shared/phase-placeholder"

export default async function JuegoSessionPage({
  params,
}: {
  params: Promise<{ juego: string; sessionId: string }>
}) {
  const { juego, sessionId } = await params
  return (
    <PhasePlaceholder
      title={juego}
      phase="Fase 5"
      detail={`Sesión ${sessionId}`}
    />
  )
}
