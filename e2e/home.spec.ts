import { expect, test } from "@playwright/test";

// Provider mock (configure dans playwright.config.ts) -> 3 matchs deterministes :
// 1 SCHEDULED, 1 LIVE, 1 FINISHED.

test.describe("accueil — 3 sections de matchs", () => {
  test("affiche le titre de l'application", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: "Coupe du Monde 2026", level: 1 }),
    ).toBeVisible();
  });

  test("affiche les sections En direct / À venir / Terminés", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "En direct" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "À venir" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Terminés" })).toBeVisible();
  });

  test("place chaque match dans la bonne section", async ({ page }) => {
    await page.goto("/");

    // Le match LIVE du mock (Bresil vs Espagne) est dans la section En direct...
    const live = page.getByRole("region", { name: "En direct" });
    await expect(live.getByText("Bresil")).toBeVisible();
    await expect(live.getByText("Espagne")).toBeVisible();
    // ...et pas dans la section Terminés.
    const finished = page.getByRole("region", { name: "Terminés" });
    await expect(finished.getByText("Bresil")).toHaveCount(0);
    // Le match FINISHED du mock (France vs Argentine) est dans Terminés.
    await expect(finished.getByText("Argentine")).toBeVisible();
  });

  test("le filtre par jour restreint la liste", async ({ page }) => {
    await page.goto("/");

    const dayGroup = page.getByRole("group", { name: "Filtrer par jour" });
    await expect(dayGroup).toBeVisible();
    const dayButtons = dayGroup.getByRole("button");
    const count = await dayButtons.count();
    // « Tous les jours » + au moins un jour distinct.
    expect(count).toBeGreaterThan(1);

    // Selectionner le premier jour concret reduit a une seule carte de match visible.
    await dayButtons.nth(1).click();
    await expect(page.getByRole("link", { name: "Voir le détail du match" })).toHaveCount(1);
  });
});
