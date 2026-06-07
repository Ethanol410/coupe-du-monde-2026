import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MatchCard } from "@/components/match/MatchCard";
import { getMatches, getTeamByCode, getTeams } from "@/lib/data";
import { fr } from "@/lib/labels/fr";

interface PageProps {
  params: Promise<{ code: string }>;
}

// ISR + prerender des 48 nations.
export const revalidate = 1800;

export function generateStaticParams(): Array<{ code: string }> {
  return getTeams()
    .map((team) => team.code)
    .filter((code): code is string => code !== null)
    .map((code) => ({ code }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { code } = await params;
  const team = getTeamByCode(code);
  if (!team) return { title: fr.app.title };
  return {
    title: team.name,
    description: `Matchs de ${team.name} à la Coupe du Monde 2026 : prochain match, dernier résultat et calendrier.`,
  };
}

export default async function TeamPage({ params }: PageProps) {
  const { code } = await params;
  const team = getTeamByCode(code);
  if (!team) notFound();

  const matches = await getMatches({ teamId: team.id });
  const finished = matches.filter((m) => m.status === "FINISHED");
  const lastResult = finished.at(-1) ?? null;
  const nextMatch = matches.find((m) => m.status !== "FINISHED") ?? null;

  return (
    <main id="main" className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
      <Link
        href="/"
        className="font-display text-sm uppercase tracking-wide text-primary hover:underline"
      >
        {fr.match.back}
      </Link>

      <header className="mt-6 flex items-center gap-4">
        {team.flagUrl ? (
          <Image
            src={team.flagUrl}
            alt={fr.a11y.flagOf(team.name)}
            width={56}
            height={42}
            className="h-10 w-14 shrink-0 border-2 border-border object-cover"
            unoptimized
          />
        ) : (
          <span
            className="h-10 w-14 shrink-0 border-2 border-border bg-secondary"
            aria-hidden
          />
        )}
        <h1 className="text-4xl sm:text-5xl">{team.name}</h1>
        {team.code && (
          <span className="font-display text-lg text-muted-foreground tabular-nums">
            {team.code}
          </span>
        )}
      </header>

      {(nextMatch || lastResult) && (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {nextMatch && (
            <section aria-label={fr.team.nextMatch} className="flex flex-col gap-2">
              <h2 className="border-b-2 border-border pb-1 text-xl">
                {fr.team.nextMatch}
              </h2>
              <MatchCard match={nextMatch} />
            </section>
          )}
          {lastResult && (
            <section aria-label={fr.team.lastResult} className="flex flex-col gap-2">
              <h2 className="border-b-2 border-border pb-1 text-xl">
                {fr.team.lastResult}
              </h2>
              <MatchCard match={lastResult} />
            </section>
          )}
        </div>
      )}

      <section className="mt-8" aria-label={fr.team.allMatches}>
        <h2 className="mb-3 border-b-2 border-border pb-1 text-2xl">
          {fr.team.allMatches}
        </h2>
        {matches.length === 0 ? (
          <p className="font-sans text-muted-foreground">{fr.team.noMatches}</p>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {matches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
