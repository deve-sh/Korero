import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";

import configStore from "../../config";

import type User from "../../types/User";
import getAuth from "../../firebase/authentication";
import useAuth from "../state/auth";
import { signOut } from "../../API/auth";

const useOnAuthStateChange = () => {
	const [user, setUser] = useAuth();

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(getAuth(), async (user) => {
			if (!user) return setUser(null);

			// Check for user authenticity
			const { isUserAllowed } = configStore.get();
			const shouldCheckForUserAuthenticity =
				typeof isUserAllowed === "function";
			if (shouldCheckForUserAuthenticity) {
				const signedInUser = user as User;
				const isValidUser = await isUserAllowed(signedInUser);
				if (!isValidUser) await signOut();
			}

			const userObj = {
				uid: user.email,
				email: user.email,
				photoURL: user.photoURL,
				phoneNumber: user.phoneNumber,
				displayName: user.displayName,
			} as User;
			setUser(userObj);
		});

		return unsubscribe;
	}, []);
};

export default useOnAuthStateChange;
