import { describe, expect, it } from "vitest";
import { getTeamByCode, getTeams } from "./teams";

describe("data/teams", () => {
  it("expose les 48 nations", () => {
    expect(getTeams()).toHaveLength(48);
  });

  it("resout une equipe par code FIFA (insensible a la casse)", () => {
    const sample = getTeams()[0]!;
    expect(sample.code).not.toBeNull();
    const found = getTeamByCode(sample.code!.toLowerCase());
    expect(found?.id).toBe(sample.id);
  });

  it("renvoie null pour un code inconnu", () => {
    expect(getTeamByCode("ZZZ")).toBeNull();
  });
});
