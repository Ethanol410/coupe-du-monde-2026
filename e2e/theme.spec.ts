import { expect, test } from "@playwright/test";

test("le toggle bascule le thème sombre", async ({ page }) => {
  await page.goto("/");
  const toggle = page.getByRole("button", {
    name: "Basculer le thème clair/sombre",
  });
  await toggle.click();
  await expect(page.locator("html")).toHaveClass(/dark/);
});
