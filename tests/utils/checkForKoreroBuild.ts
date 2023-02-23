import { execSync } from "child_process";
import { readFileSync } from "fs";
import { resolve } from "path";

import type {
	TestType,
	PlaywrightTestArgs,
	PlaywrightTestOptions,
	PlaywrightWorkerArgs,
	PlaywrightWorkerOptions,
} from "@playwright/test";

const checkForKoreroBuild = (
	test: TestType<
		PlaywrightTestArgs & PlaywrightTestOptions,
		PlaywrightWorkerArgs & PlaywrightWorkerOptions
	>
) => {
	test.beforeAll(() => {
		const umdFilePath = resolve(__dirname, "../../dist/umd.js");
		try {
			readFileSync(umdFilePath, "utf-8");
		} catch {
			// File does not exist.
			// Run build
			console.log(
				"Korero is not present yet, building distribution for testing"
			);
			execSync("npm run build", { stdio: "inherit" });
		}
	});
};

export default checkForKoreroBuild;
