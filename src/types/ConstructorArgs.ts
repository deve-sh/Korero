import type FirebaseCredentials from "./FirebaseCredentials";
import type Config from "./Config";

export default interface ConstructorArgs {
	apiKey?: string;
	firebaseCredentials?: FirebaseCredentials;
	options?: Config;
}
