import { expect, test } from "@playwright/test";

test("le toggle bascule le thème sombre", async ({ page }) => {
  await page.goto("/");
  const toggle = page.getByRole("button", {
    name: "Basculer le thème clair/sombre",
  });
  const html = page.locator("html");

  // Reessaie clic + assertion : absorbe le clic perdu avant l'hydratation React.
  await expect(async () => {
    await toggle.click();
    await expect(html).toHaveClass(/dark/, { timeout: 1500 });
  }).toPass({ timeout: 10_000 });
});
