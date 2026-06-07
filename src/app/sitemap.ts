import type { MetadataRoute } from "next";
import { getStaticMatches, getStaticTeams } from "@/lib/providers/static";

// Normalise le slash final eventuel (evite les doubles slashes dans les URLs).
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(
  /\/+$/,
  "",
);

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticRoutes: MetadataRoute.Sitemap = ["", "/groupes", "/bracket"].map(
    (path) => ({ url: `${siteUrl}${path}`, lastModified }),
  );

  const matchRoutes: MetadataRoute.Sitemap = getStaticMatches().map((match) => ({
    url: `${siteUrl}/match/${match.id}`,
    lastModified,
  }));

  const teamRoutes: MetadataRoute.Sitemap = getStaticTeams()
    .filter((team) => team.code !== null)
    .map((team) => ({ url: `${siteUrl}/equipe/${team.code}`, lastModified }));

  return [...staticRoutes, ...matchRoutes, ...teamRoutes];
}
