import { PhasePlaceholder } from "@/components/shared/phase-placeholder"

export default async function ChatPage({
  params,
}: {
  params: Promise<{ matchId: string }>
}) {
  const { matchId } = await params
  return (
    <PhasePlaceholder
      title="Chat"
      phase="Fase 6"
      detail={`Match ${matchId}. Bloqueado hasta terminar Esto o Esto.`}
    />
  )
}
