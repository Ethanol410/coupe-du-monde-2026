import Image from "next/image";
import { fr } from "@/lib/labels/fr";
import type { Team } from "@/lib/providers/types";

/** Ligne d'equipe : drapeau (dims fixes -> pas de CLS) + nom + code FIFA. */
export function TeamRow({ team }: { team: Team }) {
  return (
    <div className="flex min-w-0 flex-1 items-center gap-3">
      {team.flagUrl ? (
        <Image
          src={team.flagUrl}
          alt={fr.a11y.flagOf(team.name)}
          width={32}
          height={24}
          className="h-6 w-8 shrink-0 border border-border object-cover"
          unoptimized
        />
      ) : (
        <span
          className="h-6 w-8 shrink-0 border border-border bg-secondary"
          aria-hidden
        />
      )}
      <span className="truncate font-display text-lg font-semibold uppercase leading-tight">
        {team.name}
      </span>
      {team.code && (
        <span className="ml-auto shrink-0 font-sans text-xs text-muted-foreground tabular-nums">
          {team.code}
        </span>
      )}
    </div>
  );
}
