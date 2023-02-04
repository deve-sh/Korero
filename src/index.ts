import type ConstructorArgs from "./types/ConstructorArgs";
import type FirebaseCredentials from "./types/FirebaseCredentials";
import type OperationMode from "./types/OperationMode";

import {
	INVALID_CONSTRUCTUR_ARGS_SUPPLIED,
	INVALID_ENVIRONMENT,
} from "./constants/errors";
import initializeFirebase from "./firebase/app";

import configStore from "./config";

import { mountUI, unmountUI } from "./ui";

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

		this.firebaseCredentials = firebaseCredentials;
		this.apiKey = apiKey || "";
		if (firebaseCredentials) {
			this.mode = "firebase";
			initializeFirebase(this.firebaseCredentials);
		}

		if (options) configStore.set(options);
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
