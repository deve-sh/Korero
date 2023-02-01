import type SupportedAuthMethods from "./SupportedAuthTypes";

interface Config {
	allowedUsersRegex?: RegExp;
	allowedSignInMethods?: SupportedAuthMethods[];
	currentSiteVersion?: string;
}

export default Config;
