import type {
	TestType,
	PlaywrightTestArgs,
	PlaywrightTestOptions,
	PlaywrightWorkerArgs,
	PlaywrightWorkerOptions,
} from "@playwright/test";

import setupMockCustomerWebsiteServer from "../mocks/customerWebsiteServer";

const setupAndTeardownMockServer = async (
	test: TestType<
		PlaywrightTestArgs & PlaywrightTestOptions,
		PlaywrightWorkerArgs & PlaywrightWorkerOptions
	>
) => {
	let mockCustomerWebsiteServer;
	test.beforeAll(async () => {
		mockCustomerWebsiteServer = await setupMockCustomerWebsiteServer();
	});
	test.afterAll(async () => {
		if (mockCustomerWebsiteServer) mockCustomerWebsiteServer.close();
	});
};

export default setupAndTeardownMockServer;
