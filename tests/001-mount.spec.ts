import { test, expect } from "@playwright/test";

import checkForKoreroBuild from "./utils/checkForKoreroBuild";
import setupAndTeardownMockServer from "./utils/setupAndTeardownMockServer";

checkForKoreroBuild(test);
setupAndTeardownMockServer(test);

test("The mock customer website server should be running", async ({ page }) => {
	await page.goto("http://localhost:5050");
	await expect(page).toHaveTitle(/Korero - Testing HTML File/);
});

test("The umd script for korero should be loading", async ({ page }) => {
	const response = await page.goto("http://localhost:5050/umd.js");
	expect(response?.status()).toBe(200);
	expect(await page.content()).not.toBeFalsy();
});

test("The mock customer website should have a korero initializer script tag", async ({
	page,
}) => {
	await page.goto("http://localhost:5050");
	const initializerScriptTag = await page.evaluate(
		"document.querySelector('script[id=\"korero-initializer\"]')"
	);
	expect(initializerScriptTag).not.toBeNull();
});

test("The mock customer website should have a korero script tag", async ({
	page,
}) => {
	await page.goto("http://localhost:5050");
	await page.mainFrame().waitForFunction("window.koreroScriptAdded === true");
	const scriptTag = await page.evaluate(
		"document.querySelector('script[id=\"korero\"]')"
	);
	expect(scriptTag).not.toBeNull();
});

test("Once initialized, there should be a mounted Korero div", async ({
	page,
}) => {
	await page.goto("http://localhost:5050");
	await page
		.mainFrame()
		.waitForFunction("window.koreroDivInitialized === true");
	const koreroContainerTag = await page.evaluate(
		"document.getElementById('korero-container')"
	);
	expect(koreroContainerTag).not.toBeNull();
});

test.afterAll(async ({ page }) => {
	await page.close();
});
