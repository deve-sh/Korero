import { useEffect } from "react";

import { removePresenceStatus, setPresenceStatus } from "../../API/presence";

import useAuth from "../state/auth";

const useMarkPresence = () => {
	const [user] = useAuth();

	useEffect(() => {
		if (user) {
			setPresenceStatus(user, "online");

			const onVisibilityChange = () => {
				if (document.hidden || document.visibilityState === "hidden")
					setPresenceStatus(user, "idle");
			};
			const onWindowFocus = () => setPresenceStatus(user, "online");
			const onTabClose = () => removePresenceStatus(user.uid);

			document.addEventListener("visibilitychange", onVisibilityChange);
			window.addEventListener("focus", onWindowFocus);
			window.addEventListener("beforeunload", onTabClose);

			return () => {
				removePresenceStatus(user.uid);
				window.removeEventListener("beforeunload", onTabClose);
				window.removeEventListener("focus", onWindowFocus);
				document.removeEventListener("visibilitychange", onVisibilityChange);
			};
		}
	}, [user?.uid]);
};

export default useMarkPresence;
