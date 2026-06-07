import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LocalTime } from "@/components/LocalTime";
import { ScoreValue } from "@/components/match/MatchScore";
import { StatusBadge } from "@/components/match/StatusBadge";
import { TeamRow } from "@/components/match/TeamRow";
import { Timeline } from "@/components/match/Timeline";
import { getMatchById } from "@/lib/data";
import { fr, groupLabel, stageLabel } from "@/lib/labels/fr";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const match = await getMatchById(id);
  if (!match) return { title: fr.app.title };

  const title = `${match.home.name} ${fr.match.versus} ${match.away.name} — ${fr.app.title}`;
  const description = fr.detail.metaDescription(match.home.name, match.away.name);
  return {
    title,
    description,
    openGraph: { title, description, type: "website" },
  };
}

export default async function MatchPage({ params }: PageProps) {
  const { id } = await params;
  const match = await getMatchById(id);
  if (!match) notFound();

  const showScore =
    match.status === "LIVE" ||
    match.status === "HALFTIME" ||
    match.status === "FINISHED";
  const label = match.group ? groupLabel(match.group) : stageLabel(match.stage);

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
      <Link
        href="/"
        className="font-display text-sm uppercase tracking-wide text-primary hover:underline"
      >
        {fr.match.back}
      </Link>

      <article className="mt-6 border-2 border-border bg-card">
        <div className="flex items-center justify-between gap-2 border-b border-border px-5 py-3">
          <span className="font-display text-sm uppercase tracking-widest text-muted-foreground">
            {label}
          </span>
          <StatusBadge status={match.status} minute={match.minute} />
        </div>

        <div className="flex flex-col gap-3 px-5 py-5">
          <div className="flex items-center gap-3">
            <TeamRow team={match.home} />
            <ScoreValue value={showScore ? match.score.home : null} dimmed={!showScore} />
          </div>
          <div className="flex items-center gap-3">
            <TeamRow team={match.away} />
            <ScoreValue value={showScore ? match.score.away : null} dimmed={!showScore} />
          </div>
        </div>

        <div className="flex flex-col gap-1 border-t border-border px-5 py-3 font-sans text-sm text-muted-foreground">
          <span>
            {match.venue.name}
            {match.venue.city ? ` · ${match.venue.city}` : ""}
          </span>
          <LocalTime iso={match.kickoff} withDate />
        </div>
      </article>

      <section className="mt-8" aria-label={fr.detail.timeline}>
        <h2 className="mb-3 border-b-2 border-border pb-1 text-2xl">
          {fr.detail.timeline}
        </h2>
        <Timeline events={match.events} />
      </section>

      <section className="mt-8" aria-label={fr.detail.lineups}>
        <h2 className="mb-3 border-b-2 border-border pb-1 text-2xl">
          {fr.detail.lineups}
        </h2>
        {match.lineups ? null : (
          <p className="font-sans text-muted-foreground">
            {fr.detail.lineupsUnavailable}
          </p>
        )}
      </section>
    </main>
  );
}
