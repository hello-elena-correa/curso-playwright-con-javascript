async function login(page) {
    await test.step("login", async () => {
        await page.getByRole("textbox", { name: "Username" }).fill("standard_user");
        await page.getByRole("textbox", { name: "Password" }).fill("secret_sauce");
        await page.getByRole("button", { name: "Login" }).click();

        await page.screenshot({ path: 'saucedemoportal.png', fullPage: true });
        
        await expect(await page.getByText("Products")).toBeVisible();
    })
}