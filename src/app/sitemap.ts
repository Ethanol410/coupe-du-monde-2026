import type { MetadataRoute } from "next";
import { getStaticMatches } from "@/lib/providers/static";

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

  return [...staticRoutes, ...matchRoutes];
}
