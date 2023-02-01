import {
	signInWithPopup,
	signOut as firebaseSignOut,
	GoogleAuthProvider,
	GithubAuthProvider,
} from "firebase/auth";

import type SupportedAuthMethods from "../types/SupportedAuthTypes";
import getAuth from "../firebase/authentication";

import configStore from "../config";

export const signOut = async () => {
	try {
		return { data: await firebaseSignOut(getAuth()) };
	} catch (error) {
		return { error };
	}
};

export const signIn = async (method: SupportedAuthMethods) => {
	try {
		let data;
		if (method === "google")
			data = await signInWithPopup(getAuth(), new GoogleAuthProvider());
		if (method === "github")
			data = await signInWithPopup(getAuth(), new GithubAuthProvider());

		// Check for user authenticity
		const userEmail = data?.user.email || "";
		const { allowedUsersRegex } = configStore.get();
		if (allowedUsersRegex && !allowedUsersRegex.test(userEmail)) {
			await signOut();
			throw new Error("You are not allowed to use this feature.");
		}

		return { data };
	} catch (error) {
		return { error };
	}
};
