import { describe, expect, it } from "vitest";
import { formatKickoffDate, formatKickoffTime, localDayKey } from "./datetime";

const OPENER = "2026-06-11T19:00:00.000Z"; // coup d'envoi du match d'ouverture (UTC)

describe("formatKickoffTime", () => {
  it("convertit au fuseau Europe/Paris (UTC+2 en juin)", () => {
    expect(formatKickoffTime(OPENER, "fr-FR", "Europe/Paris")).toBe("21:00");
  });

  it("convertit au fuseau America/Los_Angeles (UTC-7 en juin)", () => {
    expect(formatKickoffTime(OPENER, "fr-FR", "America/Los_Angeles")).toBe("12:00");
  });
});

describe("formatKickoffDate", () => {
  it("rend une date courte FR avec le mois", () => {
    expect(formatKickoffDate(OPENER, "fr-FR", "Europe/Paris")).toContain("11");
    expect(formatKickoffDate(OPENER, "fr-FR", "Europe/Paris").toLowerCase()).toContain(
      "juin",
    );
  });
});

describe("localDayKey", () => {
  it("renvoie le jour ISO dans le fuseau d'affichage", () => {
    expect(localDayKey(OPENER, "Europe/Paris")).toBe("2026-06-11");
  });

  it("gere le passage de minuit selon le fuseau", () => {
    // 01:00 UTC le 12 -> 18:00 le 11 a Los Angeles (UTC-7).
    expect(localDayKey("2026-06-12T01:00:00.000Z", "America/Los_Angeles")).toBe(
      "2026-06-11",
    );
  });
});
