import { fr } from "@/lib/labels/fr";

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
        {fr.app.title}
      </h1>
      <p className="text-muted-foreground max-w-prose text-lg">
        {fr.app.tagline}
      </p>
    </main>
  );
}
