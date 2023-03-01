import { test, expect } from "@playwright/test";

import checkForKoreroBuild from "./utils/checkForKoreroBuild";
import setupAndTeardownMockServer from "./utils/setupAndTeardownMockServer";

checkForKoreroBuild(test);
setupAndTeardownMockServer(test);

const waitForKoreroToLoad = async (page) => {
	await page.goto("http://localhost:5050");
	await page.mainFrame().waitForFunction("window.koreroScriptAdded === true");
};

test("The central action handle should be visible", async ({ page }) => {
	await waitForKoreroToLoad(page);
	expect(await page.$(".central-action-handle")).not.toBeNull();
});

test("There should be a sign in message", async ({ page }) => {
	await waitForKoreroToLoad(page);
	expect(await page.getByText("Sign In To Comment")).not.toBeNull();
});

test("There should be GitHub and Google Sign In methods", async ({ page }) => {
	await waitForKoreroToLoad(page);
	expect(await page.$(".github-sign-in-icon")).not.toBeNull();
	expect(await page.$(".google-sign-in-icon")).not.toBeNull();
});

test.afterAll(async ({ page }) => {
	await page.close();
});
