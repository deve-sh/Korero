import type SupportedAuthMethods from "./SupportedAuthTypes";
import type User from "./User";

interface Config {
	isUserAllowed?: (user: User) => boolean | Promise<boolean>;
	allowedSignInMethods?: SupportedAuthMethods[];
	currentSiteVersion?: string;
}

export default Config;
