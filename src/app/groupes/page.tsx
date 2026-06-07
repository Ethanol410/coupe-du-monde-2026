import type { Metadata } from "next";
import { GroupTable } from "@/components/standings/GroupTable";
import { getStandings } from "@/lib/data";
import { fr } from "@/lib/labels/fr";

export const metadata: Metadata = {
  title: fr.pages.groups,
  description: "Classements des 12 groupes de la Coupe du Monde 2026.",
};

export default async function GroupsPage() {
  const standings = await getStandings();

  return (
    <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
      <h1 className="text-4xl sm:text-5xl">{fr.pages.groups}</h1>
      <p className="mt-2 font-sans text-sm text-muted-foreground">
        {fr.standings.legend}
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {standings.map((standing) => (
          <GroupTable key={standing.group} standing={standing} />
        ))}
      </div>
    </main>
  );
}
