"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { fr } from "@/lib/labels/fr";
import { useMounted } from "@/lib/use-mounted";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();
  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label={fr.theme.toggle}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="border-2 border-transparent p-1.5 transition-colors hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      {isDark ? (
        <Moon className="size-5" aria-hidden />
      ) : (
        <Sun className="size-5" aria-hidden />
      )}
    </button>
  );
}
