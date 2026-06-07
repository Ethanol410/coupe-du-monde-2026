import { expect, test } from "@playwright/test";

test("la navigation mene aux pages Groupes et Bracket", async ({ page }) => {
  await page.goto("/");

  const nav = page.getByRole("navigation", { name: "Navigation principale" });

  await nav.getByRole("link", { name: "Groupes" }).click();
  await expect(page).toHaveURL(/\/groupes$/);
  await expect(page.getByRole("heading", { name: "Groupes", level: 1 })).toBeVisible();

  await nav.getByRole("link", { name: "Bracket" }).click();
  await expect(page).toHaveURL(/\/bracket$/);
  await expect(
    page.getByRole("heading", { name: "Tableau final", level: 1 }),
  ).toBeVisible();
});
