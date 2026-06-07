import type { Metadata } from "next";
import { Bracket } from "@/components/bracket/Bracket";
import { getBracket } from "@/lib/data";
import { fr } from "@/lib/labels/fr";

export const metadata: Metadata = {
  title: fr.bracket.title,
  description: "Tableau à élimination directe de la Coupe du Monde 2026.",
};

export default async function BracketPage() {
  const rounds = await getBracket();

  return (
    <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
      <h1 className="text-4xl sm:text-5xl">{fr.bracket.title}</h1>
      <div className="mt-6">
        <Bracket rounds={rounds} />
      </div>
    </main>
  );
}
