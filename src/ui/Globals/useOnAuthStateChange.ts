import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";

import getAuth from "../../firebase/authentication";

import type User from "../../types/User";
import useAuth from "../state/auth";

const useOnAuthStateChange = () => {
	const [user, setUser] = useAuth();

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
			if (!user) return setUser(null);

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
