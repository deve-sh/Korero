import {
	collection,
	doc,
	getDocs,
	limit,
	query,
	setDoc,
	where,
	serverTimestamp,
	type Timestamp,
	type QuerySnapshot,
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

export const processPresenceStatusDocumentsSnapshot = (
	querySnapshot: QuerySnapshot<PresenceStatusDocumentInFirestore>
): PresenceStatusDocumentInFirestore | null => {
	if (querySnapshot.empty) return null;

	const docData: PresenceStatusDocumentInFirestore =
		querySnapshot.docs[0].data();
	const uids = Object.keys(docData);
	for (const uid of uids) {
		docData[uid] = {
			...docData[uid],
			lastUpdatedAt: (docData[uid].lastUpdatedAt as Timestamp).toDate(),
		};
	}
	return docData as PresenceStatusDocumentInFirestore;
};

export const getPresenceStatusesForPageDocRef = () => {
	const url = window.location.origin + window.location.pathname;
	const collectionRef = collection(
		getFirestore(),
		PRESENCE_FIRESTORE_COLLECTION_NAME
	);

	const queryRef = query(collectionRef, where("url", "==", url), limit(1));
	return queryRef;
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
			[user.uid]: { status, lastUpdatedAt: serverTimestamp(), user },
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
		const updates = { [uid]: deleteField() };

		const docRef = doc(collectionRef, urlHash);
		await setDoc(docRef, updates, { merge: true });
		return {};
	} catch (error) {
		return { error };
	}
};
