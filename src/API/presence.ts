import {
	collection,
	doc,
	setDoc,
	serverTimestamp,
	type Timestamp,
	type DocumentSnapshot,
	deleteField,
} from "firebase/firestore";
import md5 from "md5";

import { PRESENCE_FIRESTORE_COLLECTION_NAME } from "../constants/firebase";
import getFirestore from "../firebase/firestore";

import type {
	PresenceStatus,
	PresenceStatusDocumentInFirestore,
} from "../types/PresenceStatus";
import type User from "../types/User";
import tabUniqueId from "../ui/Globals/generateUniqueIdForTab";

export const processPresenceStatusDocumentsSnapshot = (
	querySnapshot: DocumentSnapshot<PresenceStatusDocumentInFirestore>
): PresenceStatusDocumentInFirestore["uid"][] | null => {
	if (!querySnapshot.exists()) return null;

	const userIdsAlreadyMapped = new Set();
	const usersByPresence = [];

	const presenceValues = Object.values(querySnapshot.data());

	for (let presence of presenceValues) {
		if (userIdsAlreadyMapped.has(presence.user.uid)) continue;
		usersByPresence.push(presence);
	}

	return usersByPresence;
};

export const getPresenceStatusesForPageDocRef = () => {
	const url = window.location.origin + window.location.pathname;
	const urlHash = md5(url);
	const collectionRef = collection(
		getFirestore(),
		PRESENCE_FIRESTORE_COLLECTION_NAME
	);
	const docRef = doc(collectionRef, urlHash);
	return docRef;
};

export const setPresenceStatus = async (user: User, status: PresenceStatus) => {
	try {
		const url = window.location.origin + window.location.pathname;
		const urlHash = md5(url);
		const collectionRef = collection(
			getFirestore(),
			PRESENCE_FIRESTORE_COLLECTION_NAME
		);

		const docRef = doc(collectionRef, urlHash);
		const updates = {
			[user.uid + "-" + tabUniqueId]: {
				status,
				lastUpdatedAt: serverTimestamp(),
				user,
			},
		};

		await setDoc(docRef, updates, { merge: true });
		return {};
	} catch (error) {
		return { error };
	}
};

export const removePresenceStatus = async (uid: string) => {
	try {
		const url = window.location.origin + window.location.pathname;
		const urlHash = md5(url);

		const collectionRef = collection(
			getFirestore(),
			PRESENCE_FIRESTORE_COLLECTION_NAME
		);
		const updates = { [uid + "-" + tabUniqueId]: deleteField() };

		const docRef = doc(collectionRef, urlHash);
		await setDoc(docRef, updates, { merge: true });
		return {};
	} catch (error) {
		return { error };
	}
};
