import { test, expect } from "@playwright/test";

import checkForKoreroBuild from "./utils/checkForKoreroBuild";
import setupAndTeardownMockServer from "./utils/setupAndTeardownMockServer";

checkForKoreroBuild(test);
setupAndTeardownMockServer(test);

test("The mock customer website server should be running", async ({ page }) => {
	await page.goto("http://localhost:5050");
	await expect(page).toHaveTitle(/Korero - Testing HTML File/);
});
