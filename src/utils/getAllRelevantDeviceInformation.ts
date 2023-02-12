import UAParser from "ua-parser-js";

import type RelativeDeviceInfo from "../types/RelevantDeviceInfo";

const getAllRelevantDeviceInformation = (): RelativeDeviceInfo => {
	const parser = new UAParser();
	const results = parser.getResult();
	return {
		browser: results.browser,
		os: results.os,
		ua: results.ua,
	};
};

export default getAllRelevantDeviceInformation;
