export default interface FirebaseCredentials extends Record<string, string> {
	apiKey: string;
	authDomain: string;
	projectId: string;
	storageBucket: string;
	appId: string;
}
