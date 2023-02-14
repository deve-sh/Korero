import { useEffect, useMemo, useState } from "react";
import { onSnapshot } from "firebase/firestore";

import { type PresenceStatusDocumentInFirestore } from "../../types/PresenceStatus";
import {
	getPresenceStatusesForPageDocRef,
	processPresenceStatusDocumentsSnapshot,
} from "../../API/presence";

import useAuth from "../state/auth";
import UserAvatar from "./CommentThread/UserAvatar";

const PresenceIndicatorThread = () => {
	const [user] = useAuth(); // The current user, who's already online.
	const [presentUsers, setPresentUsers] = useState<
		PresenceStatusDocumentInFirestore["uid"][]
	>([]);

	useEffect(() => {
		const unsubscribeToPresence = onSnapshot(
			getPresenceStatusesForPageDocRef(),
			(presenseDocsSnapshot) => {
				const presentUsersDoc =
					processPresenceStatusDocumentsSnapshot(presenseDocsSnapshot);
				if (!presentUsersDoc) return;

				setPresentUsers(Object.values(presentUsersDoc));
			}
		);

		return unsubscribeToPresence;
	}, []);

	if (!user) return <></>;
	return (
		<>
			<UserAvatar user={user} />
			{presentUsers.map((activeOrIdleUser) => {
				if (activeOrIdleUser.user.uid === user.uid) return <></>;
				return (
					<UserAvatar
						key={activeOrIdleUser.user.uid}
						user={activeOrIdleUser.user}
					/>
				);
			})}
			|
		</>
	);
};

export default PresenceIndicatorThread;
