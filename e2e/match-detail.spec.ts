import { expect, test } from "@playwright/test";

// Provider mock : le match termine (m-finished) a 3 buts (Mbappe 23', Messi 60', Giroud 78').

test("la chronologie d'un match termine s'affiche dans l'ordre", async ({ page }) => {
  await page.goto("/");

  // Ouvrir le detail du match termine depuis la section Termines.
  const finished = page.getByRole("region", { name: "Terminés" });
  await finished.getByRole("link", { name: "Voir le détail du match" }).first().click();

  await expect(page).toHaveURL(/\/match\/m-finished$/);

  // La chronologie liste les buteurs dans l'ordre chronologique.
  const items = page.getByRole("listitem");
  await expect(items).toHaveCount(3);
  await expect(items.nth(0)).toContainText("Mbappe");
  await expect(items.nth(1)).toContainText("Messi");
  await expect(items.nth(2)).toContainText("Giroud");
});
