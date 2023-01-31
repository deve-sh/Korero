import type ConstructorArgs from "./types/ConstructorArgs";
import type FirebaseCredentials from "./types/FirebaseCredentials";
import type OperationMode from "./types/OperationMode";

import {
	INVALID_CONSTRUCTUR_ARGS_SUPPLIED,
	INVALID_ENVIRONMENT,
} from "./constants/errors";

/**
 * Usage:
 * new Korero({ apiKey: string, firebaseCredentials?: Object })
 */
class Korero {
	apiKey?: string = "";
	firebaseCredentials?: FirebaseCredentials;
	mode?: OperationMode;

	constructor({ firebaseCredentials }: ConstructorArgs = {}) {
		if (!firebaseCredentials)
			throw new Error(INVALID_CONSTRUCTUR_ARGS_SUPPLIED);
		if (typeof window === "undefined" || typeof document === "undefined")
			throw new Error(INVALID_ENVIRONMENT);

		this.firebaseCredentials = firebaseCredentials;
		if (firebaseCredentials) this.mode = "firebase";
	}

	initialize() {}

	unmount() {}
}

export default Korero;
