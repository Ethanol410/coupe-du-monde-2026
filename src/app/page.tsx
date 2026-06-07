import { HomeView } from "@/components/home/HomeView";
import { getMatches } from "@/lib/data";
import { fr } from "@/lib/labels/fr";

export default async function HomePage() {
  const matches = await getMatches();

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
      <div className="mb-8">
        <p className="font-display text-xs uppercase tracking-[0.3em] text-primary">
          {fr.app.edition}
        </p>
        <h1 className="mt-1 text-5xl sm:text-6xl">{fr.app.title}</h1>
        <p className="mt-2 font-sans text-lg text-muted-foreground">
          {fr.app.tagline}
        </p>
      </div>

      <HomeView matches={matches} />
    </main>
  );
}
