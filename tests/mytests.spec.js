const { test, expect } = require('@playwright/test');
import {login} from "./testutils";

test.beforeAll("Setup", async () => {
    console.log("Starting execution")
});

// This is inside the test context
test.beforeEach("Test setup", async ({ page }) => {
    await page.goto("/");
});

test.afterAll("Complete", async () => {
    console.log("Tests done!")
});

test.afterEach(async ({ page }, testInfo) => {
    await page.screenshot({ path: `${testInfo.title}.png`, fullPage: true });
})

test.describe("Login", () => {
    test("Login demo", async ({ page }) => {
        await page.getByRole("textbox", { name: "Username" }).fill("standard_user");
        await page.getByRole("textbox", { name: "Password" }).fill("secret_sauce");
        await page.getByRole("button", { name: "Login" }).click();

        await page.screenshot({ path: 'saucedemoportal.png', fullPage: true });

        await page.getByText('Swag Labs').screenshot({ path: 'titlescreenshot.png' });

        // Corregido: se quitó el await interno
        await expect(page.getByText("Products")).toBeVisible();
    })

    test("Login demo by CSS class, ID and data-test", async ({ page }) => {
        // by ID
        await page.locator("#user-name").fill("standard_user");

        // by attribute ID
        await page.locator("id=password").fill("secret_sauce");

        // by data-test
        await page.locator("data-test=login-button").click();

        await page.waitForURL(/.*inventory.html/);

        // by CSS class
        const productsTitle = await page.locator(".title");

        await expect(productsTitle).toHaveText("Products");
        await expect(productsTitle).toBeVisible();
        await expect(page).toHaveURL(/.*inventory.html/);
    })
})

test.describe("Login and sort", () => {
    test("Login demo and first price", async ({ page }) => {
        await login(page);

        await test.step("Verify price", async () => {
            await expect(page.locator("(//div[contains(@class, 'inventory_item_price')])[1]")).toHaveText("$29.99")
        });
    });

    test("Login demo order low to high price", async ({ page }) => {
        await login(page);

        await page.locator(".product_sort_container").selectOption("lohi");

        await expect(page.locator("(//div[contains(@class, 'inventory_item_price')])[1]")).toHaveText("$7.99")

        await expect(page.locator("(//div[contains(@class, 'inventory_item_price')])[last()]")).toHaveText("$49.99")
    });

    test("Login demo order high to low price", async ({ page }) => {
        await login(page);

        await page.locator(".product_sort_container").selectOption("hilo");

        await expect(page.locator("(//div[contains(@class, 'inventory_item_price')])[1]")).toHaveText("$49.99")

        await expect(page.locator("(//div[contains(@class, 'inventory_item_price')])[last()]")).toHaveText("$7.99")
    });

    test("Login demo order Name DESC", async ({ page }) => {
        await login(page);

        // key press
        await page.locator(".product_sort_container").press("ArrowDown");

        await expect(page.locator("(//div[contains(@class, 'inventory_item_price')])[1]")).toHaveText("$15.99")

        await expect(page.locator("(//div[contains(@class, 'inventory_item_price')])[last()]")).toHaveText("$29.99")
    });
});