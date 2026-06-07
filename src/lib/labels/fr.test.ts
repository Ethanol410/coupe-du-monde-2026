import { describe, expect, it } from "vitest";
import { fr } from "./fr";

describe("libellés FR", () => {
  it("expose le titre de l'application", () => {
    expect(fr.app.title).toBe("Coupe du Monde 2026");
  });

  it("fournit une description non vide pour les métadonnées SEO", () => {
    expect(fr.app.description.length).toBeGreaterThan(0);
  });
});
