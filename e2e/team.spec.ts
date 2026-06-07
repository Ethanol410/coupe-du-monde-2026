import { expect, test } from "@playwright/test";

// Mock : le groupe A contient France (code FRA). Le lien mene a sa fiche.
test("on accede a la fiche d'une equipe depuis un classement", async ({ page }) => {
  await page.goto("/groupes");

  await page.getByRole("link", { name: "France" }).first().click();

  await expect(page).toHaveURL(/\/equipe\/FRA$/);
  await expect(page.getByRole("heading", { name: "France", level: 1 })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Tous les matchs" }),
  ).toBeVisible();
});
