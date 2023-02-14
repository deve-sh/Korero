import {
	collection,
	doc,
	getDocs,
	limit,
	query,
	setDoc,
	where,
	type Timestamp,
	type QuerySnapshot,
} from "firebase/firestore";

import { PRESENCE_FIRESTORE_COLLECTION_NAME } from "../constants/firebase";
import getFirestore from "../firebase/firestore";

import type {
	PresenceStatus,
	PresenceStatusDocumentInFirestore,
} from "../types/PresenceStatus";
import type User from "../types/User";

// No need to store more than 10 people's activity stats as no one would be seeing more than that.
const MAX_USERS_ACTIVITY_STATS_TO_STORE = 10;

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
		const collectionRef = collection(
			getFirestore(),
			PRESENCE_FIRESTORE_COLLECTION_NAME
		);
		const queryRef = query(collectionRef, where("url", "==", url), limit(1));
		const presenceDoc = (await getDocs(queryRef)).docs[0];

		let docRef;
		const updates = { [user.uid]: { status, lastUpdatedAt: new Date(), user } };

		if (!presenceDoc) {
			// Create a new one first
			docRef = doc(collectionRef);
		} else {
			// Set the document with data
			docRef = presenceDoc.ref;

			if (
				Object.keys(presenceDoc.data()).length >
				MAX_USERS_ACTIVITY_STATS_TO_STORE
			)
				return {};
		}

		await setDoc(docRef, updates, { merge: true });

		return {};
	} catch (error) {
		return { error };
	}
};
