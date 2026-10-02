import type { Hito, Insignia, InsigniaUsuario, Profile } from "@/lib/data/types"
import type { Amistad } from "@/lib/data/types-amistad"
import { daysBetween, formatLongDate } from "@/lib/scrapbook/format"
import { WriteCapsulaSheet } from "@/components/capsulas/write-capsula-sheet"
import { stableRotation } from "@/lib/scrapbook/format"

const HITO_LABEL: Record<string, string> = {
  match: "El día del match",
  primera_partida: "Primera partida",
  primer_encuentro: "Primer encuentro real",
  capsula_abierta: "Cápsula abierta",
  lugar_nuevo: "Lugar nuevo",
  aniversario: "Aniversario",
  oficial: "Se hizo oficial",
}

export function NosotrasView({
  amistad,
  me,
  her,
  hitos,
  insignias,
  insigniasUsuario,
}: {
  amistad: Amistad
  me: Profile
  her: Profile
  hitos: Hito[]
  insignias: Insignia[]
  insigniasUsuario: InsigniaUsuario[]
}) {
  const desde = amistad.oficialDesde ?? amistad.createdAt
  const dias = daysBetween(desde)
  const mineBadges = insigniasUsuario.filter((i) => i.profileId === me.id)

  return (
    <div className="space-y-10">
      <header className="flex flex-col items-center text-center">
        <div className="flex items-center gap-3">
          <Avatar initial={me.nombre} tone="me" />
          <span
            className="w-10 border-t border-dashed border-outline"
            aria-hidden
          />
          <Avatar initial={her.nombre} tone="her" />
        </div>
        <p className="mt-4 font-sans text-label-md text-on-surface-variant">
          Amigas desde el {formatLongDate(desde)}
        </p>
        <p className="mt-2 font-serif text-display-lg text-on-surface">{dias}</p>
        <p className="font-serif text-body-md italic text-on-surface-variant">
          días
        </p>
      </header>

      <section>
        <h2 className="font-serif text-headline-sm">Línea de tiempo</h2>
        <ol className="relative mt-6 space-y-6 border-l border-outline-variant pl-6">
          {hitos.map((h) => (
            <li key={h.id} className="relative">
              <span className="absolute -left-[1.64rem] top-1 size-2.5 rounded-full bg-primary" />
              <p className="font-serif text-title-md">
                {HITO_LABEL[h.tipo] ?? h.tipo}
              </p>
              <p className="font-serif text-body-md italic text-on-surface-variant">
                {formatLongDate(h.ocurrioAt)}
              </p>
            </li>
          ))}
          {hitos.length === 0 ? (
            <li className="font-serif text-body-md italic text-on-surface-variant">
              Los hitos aparecen solos, cuando pasan.
            </li>
          ) : null}
        </ol>
      </section>

      <section>
        <h2 className="font-serif text-headline-sm">Álbum de estampillas</h2>
        <div className="mt-4 grid grid-cols-3 gap-3 rounded-xl border border-outline-variant bg-surface-container-low p-4">
          {insignias.map((ins) => {
            const earned = mineBadges.find((b) => b.insigniaId === ins.id)
            return (
              <div
                key={ins.id}
                className="flex flex-col items-center gap-1 p-2 text-center"
                style={{
                  transform: `rotate(${stableRotation(ins.id, 1.5)}deg)`,
                  opacity: earned ? 1 : 0.35,
                }}
              >
                <span
                  className="flex size-14 items-center justify-center rounded-sm border border-accent-gold bg-accent-gold/25 font-serif text-headline-sm text-on-surface shadow-paper-1"
                  aria-hidden
                >
                  {ins.emoji === "bingo" ? "🎯" : ins.emoji}
                </span>
                <span className="font-sans text-label-sm">{ins.nombre}</span>
                {earned ? (
                  <span className="font-serif text-label-sm italic text-on-surface-variant">
                    {formatLongDate(earned.ganadaAt)}
                  </span>
                ) : null}
              </div>
            )
          })}
        </div>
      </section>

      <section className="border-t border-outline-variant pt-6">
        <p className="mb-3 font-serif text-body-md italic text-on-surface-variant">
          Escribirle a nuestro futuro
        </p>
        <WriteCapsulaSheet amistadId={amistad.id} />
      </section>
    </div>
  )
}

function Avatar({
  initial,
  tone,
}: {
  initial: string
  tone: "me" | "her"
}) {
  return (
    <span
      className={
        tone === "me"
          ? "flex size-16 items-center justify-center rounded-full border-2 border-primary bg-primary-container font-serif text-headline-sm text-on-primary-container"
          : "flex size-16 items-center justify-center rounded-full border-2 border-secondary bg-secondary-container font-serif text-headline-sm text-on-secondary-container"
      }
    >
      {initial.slice(0, 1)}
    </span>
  )
}
