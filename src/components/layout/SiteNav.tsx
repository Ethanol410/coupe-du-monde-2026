"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { fr } from "@/lib/labels/fr";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/", label: fr.nav.home },
  { href: "/groupes", label: fr.nav.groups },
  { href: "/bracket", label: fr.nav.bracket },
] as const;

export function SiteNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Navigation principale" className="flex gap-1">
      {LINKS.map((link) => {
        const active =
          link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "border-2 px-3 py-1 font-display text-sm uppercase tracking-wide transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
              active
                ? "border-border bg-primary text-primary-foreground"
                : "border-transparent hover:bg-secondary",
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
