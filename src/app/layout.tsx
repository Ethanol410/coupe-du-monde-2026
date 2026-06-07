import type { Metadata } from "next";
import { Oswald, Newsreader } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { fr } from "@/lib/labels/fr";

// Police d'affichage condensee (titres, scores, noms d'equipes).
const display = Oswald({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

// Corps serif editorial (dates, stades, descriptions).
const body = Newsreader({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: fr.app.title,
    template: `%s — ${fr.app.title}`,
  },
  description: fr.app.description,
  applicationName: fr.app.title,
  openGraph: {
    title: fr.app.title,
    description: fr.app.description,
    siteName: fr.app.title,
    locale: "fr_FR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      suppressHydrationWarning
      className={`${display.variable} ${body.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:border-2 focus:border-border focus:bg-primary focus:px-3 focus:py-2 focus:font-display focus:uppercase focus:text-primary-foreground"
        >
          {fr.a11y.skipToContent}
        </a>
        <ThemeProvider>
          <QueryProvider>
            <SiteHeader />
            {children}
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
