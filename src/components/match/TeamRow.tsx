import Image from "next/image";
import Link from "next/link";
import { fr } from "@/lib/labels/fr";
import type { Team } from "@/lib/providers/types";

interface TeamRowProps {
  team: Team;
  /** Si fourni, le nom devient un lien vers la fiche equipe (a NE PAS utiliser dans une carte deja cliquable). */
  href?: string;
}

/** Ligne d'equipe : drapeau (dims fixes -> pas de CLS) + nom + code FIFA. */
export function TeamRow({ team, href }: TeamRowProps) {
  const nameClass = "truncate font-display text-lg font-semibold uppercase leading-tight";

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
      {href ? (
        <Link href={href} className={`${nameClass} hover:underline`}>
          {team.name}
        </Link>
      ) : (
        <span className={nameClass}>{team.name}</span>
      )}
      {team.code && (
        <span className="ml-auto shrink-0 font-sans text-xs text-muted-foreground tabular-nums">
          {team.code}
        </span>
      )}
    </div>
  );
}
