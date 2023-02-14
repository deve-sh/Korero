import type User from "./User";
import { type Timestamp } from "firebase/firestore";

type PresenceStatus = "online" | "idle"; // In case a user is away, their presence status is simply removed from the firestore document.

interface PresenceStatusDocumentInFirestore {
	[uid: string]: {
		status: PresenceStatus;
		lastUpdatedAt: Date | Timestamp;
		user: User;
	};
}

export { PresenceStatus, PresenceStatusDocumentInFirestore };
