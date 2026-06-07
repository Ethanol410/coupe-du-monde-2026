import { describe, expect, it } from "vitest";
import {
  getStaticGroups,
  getStaticMatches,
  getStaticTeams,
  getStaticVenues,
  toUtcIso,
} from "./static";

describe("provider statique : mapping des donnees embarquees", () => {
  it("charge 104 matchs, 48 equipes, 16 stades, 12 groupes", () => {
    expect(getStaticMatches()).toHaveLength(104);
    expect(getStaticTeams()).toHaveLength(48);
    expect(getStaticVenues()).toHaveLength(16);
    expect(getStaticGroups()).toHaveLength(12);
  });

  it("mappe le match d'ouverture (Mexico vs South Africa, groupe A, Azteca)", () => {
    const opener = getStaticMatches().find((m) => m.id === "1");
    expect(opener).toBeDefined();
    expect(opener?.home.name).toBe("Mexico");
    expect(opener?.away.name).toBe("South Africa");
    expect(opener?.stage).toBe("GROUP");
    expect(opener?.group).toBe("A");
    expect(opener?.venue.name).toBe("Estadio Azteca");
    expect(opener?.status).toBe("SCHEDULED");
    // 11/06/2026 13:00 heure de Mexico (UTC-6) -> 19:00 UTC
    expect(opener?.kickoff).toBe("2026-06-11T19:00:00.000Z");
  });

  it("renvoie des matchs tries par kickoff croissant", () => {
    const matches = getStaticMatches();
    for (let i = 1; i < matches.length; i++) {
      expect(matches[i]!.kickoff >= matches[i - 1]!.kickoff).toBe(true);
    }
  });

  it("gere les placeholders des matchs a elimination directe sans crash", () => {
    const final = getStaticMatches().find((m) => m.stage === "FINAL");
    expect(final).toBeDefined();
    expect(final?.group).toBeNull();
    expect(final?.home.code).toBeNull();
    expect(final?.home.name.length).toBeGreaterThan(0);
  });
});

describe("conversion heure locale -> UTC (DST-correct par fuseau)", () => {
  it("Mexico City (UTC-6, sans DST)", () => {
    expect(toUtcIso("06/11/2026 13:00", "1")).toBe("2026-06-11T19:00:00.000Z");
  });

  it("Atlanta / New York (EDT = UTC-4 en juin)", () => {
    expect(toUtcIso("06/15/2026 15:00", "7")).toBe("2026-06-15T19:00:00.000Z");
  });

  it("Los Angeles (PDT = UTC-7 en juin)", () => {
    expect(toUtcIso("06/15/2026 12:00", "16")).toBe("2026-06-15T19:00:00.000Z");
  });

  it("Toronto (EDT = UTC-4 en juin)", () => {
    expect(toUtcIso("06/15/2026 16:00", "12")).toBe("2026-06-15T20:00:00.000Z");
  });

  it("rejette un format de date inattendu", () => {
    expect(() => toUtcIso("June 11, 2026", "1")).toThrow();
  });
});
