import type ConstructorArgs from "./types/ConstructorArgs";
import type FirebaseCredentials from "./types/FirebaseCredentials";
import type OperationMode from "./types/OperationMode";

import {
	INVALID_CONSTRUCTUR_ARGS_SUPPLIED,
	INVALID_ENVIRONMENT,
} from "./constants/errors";
import initializeFirebase from "./firebase/app";
import mountContainerDiv from "./core/mountContainerDiv";
import unmountContainerDiv from "./core/unmountContainerDiv";

/**
 * Usage:
 * new Korero({ apiKey: string, firebaseCredentials?: Object })
 */
class Korero {
	apiKey?: string = "";
	firebaseCredentials?: FirebaseCredentials;
	mode?: OperationMode;

	show: boolean = false;
	commentingTurnedOn: boolean = false;

	constructor({ firebaseCredentials }: ConstructorArgs = {}) {
		if (!firebaseCredentials)
			throw new Error(INVALID_CONSTRUCTUR_ARGS_SUPPLIED);
		if (typeof window === "undefined" || typeof document === "undefined")
			throw new Error(INVALID_ENVIRONMENT);

		this.firebaseCredentials = firebaseCredentials;
		if (firebaseCredentials) {
			this.mode = "firebase";
			initializeFirebase(this.firebaseCredentials);
		}
	}

	initialize() {
		this.show = true;
		mountContainerDiv();
	}

	toggleCommenting() {
		this.commentingTurnedOn = !this.commentingTurnedOn;
	}

	unmount() {
		this.show = false;
		this.commentingTurnedOn = false;
		unmountContainerDiv();
	}
}

export default Korero;
