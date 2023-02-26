import type ConstructorArgs from "./types/ConstructorArgs";
import type FirebaseCredentials from "./types/FirebaseCredentials";
import type OperationMode from "./types/OperationMode";

import {
	INVALID_CONSTRUCTUR_ARGS_SUPPLIED,
	INVALID_ENVIRONMENT,
	INVALID_OPTIONS,
	INVALID_SIGNIN_METHODS,
	INVALID_HOST,
	NON_PRESENT_ROOT_ELEMENT,
	INVALID_ROOT_ELEMENT,
} from "./constants/errors";
import initializeFirebase from "./firebase/app";

import configStore from "./config";

import { mountUI, unmountUI } from "./ui";
import koreroInstanceStore from "./config/koreroInstanceStore";

/**
 * Usage:
 * new Korero({ apiKey: string, firebaseCredentials?: Object })
 */
class Korero {
	private apiKey?: string = "";
	private firebaseCredentials?: FirebaseCredentials;
	private mode?: OperationMode;

	constructor({ apiKey, firebaseCredentials, options }: ConstructorArgs = {}) {
		if (!firebaseCredentials)
			throw new Error(INVALID_CONSTRUCTUR_ARGS_SUPPLIED);
		if (typeof window === "undefined" || typeof document === "undefined")
			throw new Error(INVALID_ENVIRONMENT);
		if (!options || typeof options !== "object")
			throw new Error(INVALID_OPTIONS);
		if (!options.allowedSignInMethods || !options.allowedSignInMethods.length)
			throw new Error(INVALID_SIGNIN_METHODS);
		if (
			options.whitelistedHosts &&
			!options.whitelistedHosts.includes(window.location.hostname)
		)
			throw new Error(INVALID_HOST);
		// if (!options.rootElement) throw new Error(NON_PRESENT_ROOT_ELEMENT);
		// if (
		// 	options.rootElement === document.head ||
		// 	options.rootElement === document.body ||
		// 	options.rootElement === document.head.parentElement
		// )
		// 	throw new Error(INVALID_ROOT_ELEMENT);

		this.firebaseCredentials = firebaseCredentials;
		this.apiKey = apiKey || "";
		if (firebaseCredentials) {
			this.mode = "firebase";
			initializeFirebase(this.firebaseCredentials);
		}

		configStore.set(options);
		koreroInstanceStore.set(this);
	}

	initialize() {
		mountUI();
	}

	unmount() {
		unmountUI();
	}
}

export { Korero };
export default Korero;
