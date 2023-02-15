import { useEffect } from "react";

import {
	deleteStaleEntriesInCurrentPagePresence,
	removePresenceStatus,
	setPresenceStatus,
} from "../../API/presence";

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

			// Every user connected to the system in real-time at some point will take ownership of clearing stale data for presence
			// This can happen due to unclean exits from a page leading to onbeforeunload not firing and hence presence data being left from hours ago.
			// The base for this is a random timeout so not a lot of end user devices do it all at once.
			// And a Firestore transaction with a metadata document. A firestore transaction guarantees that a change to a document that's important to a transaction
			// will be accounted for and hence the clients update the metadata document with a 'beingUpdated' field at the start of a transaction
			// Any other client that might be making a transaction for the same purpose will get notified of the change and either stop or block any others from doing so.
			const randomStaleDataRemovalTimeoutInterval =
				60 * 1000 + Math.ceil(10 * 1000 * Math.random());
			const randomStaleDataRemovalTimeout = setTimeout(
				deleteStaleEntriesInCurrentPagePresence,
				randomStaleDataRemovalTimeoutInterval
			);

			return () => {
				removePresenceStatus(user.uid);
				window.removeEventListener("beforeunload", onTabClose);
				window.removeEventListener("focus", onWindowFocus);
				document.removeEventListener("visibilitychange", onVisibilityChange);

				if (randomStaleDataRemovalTimeout)
					clearTimeout(randomStaleDataRemovalTimeout);
			};
		}
	}, [user?.uid]);
};

export default useMarkPresence;
