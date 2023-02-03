import {
	signInWithPopup,
	signOut as firebaseSignOut,
	GoogleAuthProvider,
	GithubAuthProvider,
} from "firebase/auth";

import type SupportedAuthMethods from "../types/SupportedAuthTypes";
import type User from "../types/User";
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

		if (!data || !data.user)
			throw new Error("Something went wrong with user sign in.");

		// Check for user authenticity
		const { isUserAllowed } = configStore.get();
		const shouldCheckForUserAuthenticity = typeof isUserAllowed === "function";
		if (shouldCheckForUserAuthenticity) {
			const signedInUser = data.user as User;
			const isValidUser = await isUserAllowed(signedInUser);
			if (isValidUser) return { data };

			await signOut();
			throw new Error("You are not allowed to use this feature.");
		}

		return { data };
	} catch (error) {
		return { error };
	}
};
