import Image from "next/image";
import Link from "next/link";
import { fr } from "@/lib/labels/fr";
import { SiteNav } from "./SiteNav";
import { ThemeToggle } from "./ThemeToggle";

export function SiteHeader() {
  return (
    <header className="border-b-2 border-border">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" aria-label={fr.app.title} className="shrink-0">
          {/* Logo adapte au theme : noir sur fond clair, blanc sur fond sombre. */}
          <Image
            src="/logo-noir.png"
            alt=""
            width={44}
            height={44}
            priority
            unoptimized
            className="size-11 dark:hidden"
          />
          <Image
            src="/logo-blanc.png"
            alt=""
            width={44}
            height={44}
            priority
            unoptimized
            className="hidden size-11 dark:block"
          />
        </Link>
        <div className="flex items-center gap-2">
          <SiteNav />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
