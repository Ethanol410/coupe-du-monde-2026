import { describe, expect, it } from "vitest";
import sitemap from "./sitemap";

describe("sitemap", () => {
  it("inclut accueil, groupes, bracket et les 104 matchs", () => {
    const urls = sitemap().map((entry) => entry.url);
    expect(urls.some((u) => u.endsWith("/groupes"))).toBe(true);
    expect(urls.some((u) => u.endsWith("/bracket"))).toBe(true);
    expect(urls.filter((u) => u.includes("/match/")).length).toBe(104);
  });
});
