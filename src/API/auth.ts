import {
	signInWithPopup,
	signOut,
	GoogleAuthProvider,
	GithubAuthProvider,
} from "firebase/auth";

import type SupportedAuthMethods from "../types/SupportedAuthTypes";
import getAuth from "../firebase/authentication";

export const signIn = async (method: SupportedAuthMethods) => {
	try {
		let data;
		if (method === "google")
			data = await signInWithPopup(getAuth(), new GoogleAuthProvider());
		if (method === "github")
			data = await signInWithPopup(getAuth(), new GithubAuthProvider());
		return { data };
	} catch (error) {
		return { error };
	}
};

export const signOutOfKorero = async () => {
	try {
		return { data: await signOut(getAuth()) };
	} catch (error) {
		return { error };
	}
};
