import Link from "next/link";
import { fr } from "@/lib/labels/fr";
import { SiteNav } from "./SiteNav";
import { ThemeToggle } from "./ThemeToggle";

export function SiteHeader() {
  return (
    <header className="border-b-2 border-border">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link
          href="/"
          className="font-display text-xl font-bold uppercase tracking-tight"
        >
          {fr.app.wordmark}
        </Link>
        <div className="flex items-center gap-2">
          <SiteNav />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
