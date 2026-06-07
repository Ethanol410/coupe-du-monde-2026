import { expect, test } from "@playwright/test";

test("la page d'accueil affiche le titre de l'application", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Coupe du Monde 2026" }),
  ).toBeVisible();
});
