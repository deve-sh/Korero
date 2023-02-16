import {
	collection,
	doc,
	setDoc,
	updateDoc,
	serverTimestamp,
	deleteField,
	runTransaction,
	type DocumentSnapshot,
	type FieldValue,
	type Timestamp,
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

const getURLHash = () => {
	const url = window.location.origin + window.location.pathname;
	const urlHash = md5(url);
	return urlHash;
};

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
	const urlHash = getURLHash();
	const collectionRef = collection(
		getFirestore(),
		PRESENCE_FIRESTORE_COLLECTION_NAME
	);
	const docRef = doc(collectionRef, urlHash);
	return docRef;
};

export const setPresenceStatus = async (user: User, status: PresenceStatus) => {
	try {
		const urlHash = getURLHash();
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
		const urlHash = getURLHash();
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

export const deleteStaleEntriesInCurrentPagePresence = async () => {
	try {
		const urlHash = getURLHash();
		const collectionRef = collection(
			getFirestore(),
			PRESENCE_FIRESTORE_COLLECTION_NAME
		);
		const metadataDocRef = doc(
			collectionRef,
			urlHash,
			"presencemetadata",
			"metadatadoc"
		); // Metadata subcollection
		const presenceDocRef = doc(collectionRef, urlHash);
		await runTransaction(getFirestore(), async (transaction) => {
			// Running this as a transaction given transactions in Firestore will ensure that if the underlying document has changed.
			// The computation happens again.
			const metadataDoc = await transaction.get(metadataDocRef);
			if (!metadataDoc.data() || metadataDoc.data()?.beingUpdated)
				// Safe to do, firestore's transactions will take care of any conflicts.
				await updateDoc(metadataDocRef, { beingUpdated: true });

			const presenceDoc = await transaction.get(presenceDocRef);
			const presenceData =
				presenceDoc.data() as PresenceStatusDocumentInFirestore;
			const docUpdates: Record<string, FieldValue> = {};
			for (let uid in presenceData) {
				if (!presenceData.hasOwnProperty(uid)) continue;
				const lastUpdatedAt = presenceData[uid].lastUpdatedAt as Timestamp;
				// This is obviously not fool proof given the end user's date might be out of sync.
				// But since this is an internal team collaboration tool, the chances for that happening are significantly low.
				const oneHourBefore = new Date().getTime() - 60 * 60 * 1000;
				if (lastUpdatedAt.toDate().getTime() < oneHourBefore)
					docUpdates[uid] = deleteField();
			}
			transaction.update(presenceDocRef, docUpdates);
		});
		await updateDoc(metadataDocRef, { beingUpdated: false });
	} catch (error) {
		return { error };
	}
};
