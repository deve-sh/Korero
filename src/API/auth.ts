import {
	signInWithPopup,
	signOut as firebaseSignOut,
	GoogleAuthProvider,
	GithubAuthProvider,
} from "firebase/auth";

import type SupportedAuthMethods from "../types/SupportedAuthTypes";
import getAuth from "../firebase/authentication";

export const signOut = async () => {
	try {
		return { data: await firebaseSignOut(getAuth()) };
	} catch (error) {
		return { error };
	}
};

export const signIn = async (method: SupportedAuthMethods) => {
	try {
		const data = await signInWithPopup(
			getAuth(),
			method === "google" ? new GoogleAuthProvider() : new GithubAuthProvider()
		);

		if (!data || !data.user)
			throw new Error("Something went wrong with user sign in.");

		return { data };
	} catch (error) {
		return { error };
	}
};
