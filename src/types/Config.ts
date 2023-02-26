import type SupportedAuthMethods from "./SupportedAuthTypes";
import type User from "./User";

interface Config {
	rootElement?: HTMLElement;
	isUserAllowed?: (user: User) => boolean | Promise<boolean>;
	allowedSignInMethods?: SupportedAuthMethods[];
	currentSiteVersion?: string;
	whitelistedHosts?: string[];
}

export default Config;
