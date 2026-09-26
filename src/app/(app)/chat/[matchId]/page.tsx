import { PhasePlaceholder } from "@/components/shared/phase-placeholder"

export default async function ChatPage({
  params,
}: {
  params: Promise<{ matchId: string }>
}) {
  const { matchId } = await params
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <PhasePlaceholder
        title="Chat"
        phase="Fase 6"
        detail={`Match ${matchId}. Bloqueado hasta terminar Esto o Esto.`}
        icon="construction"
      />
    </div>
  )
}
