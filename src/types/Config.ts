import type SupportedAuthMethods from "./SupportedAuthTypes";

interface Config {
	allowedUsersRegex?: RegExp;
	allowedSignInMethods?: SupportedAuthMethods[];
}

export default Config;
