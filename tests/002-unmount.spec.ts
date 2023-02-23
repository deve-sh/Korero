import { test, expect } from "@playwright/test";

test("It should remove the container div on calling of unmount", async ({
	page,
}) => {
	await page.goto("http://localhost:5050");
	await page
		.mainFrame()
		.waitForFunction("window.koreroDivInitialized === true");
	await page.evaluate("window.unmountKorero()");
	const koreroContainerTag = await page.evaluate(
		"document.getElementById('korero-container')"
	);
	expect(koreroContainerTag).toBeNull();
});
