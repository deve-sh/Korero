import {
	collection,
	query,
	where,
	getDocs,
	type Query,
	type QueryConstraint,
	type QuerySnapshot,
	type Timestamp,
	doc,
	setDoc,
	deleteDoc,
	updateDoc,
	arrayUnion,
	runTransaction,
} from "firebase/firestore";
import getFirestore from "../firebase/firestore";

import CommentInDatabase, { CommentReply } from "../types/CommentInDatabase";
import { COMMENTS_FIRESTORE_COLLECTION_NAME } from "../constants/firebase";

import configStore from "../config";

export const processCommentDocs = (
	querySnapshot: QuerySnapshot<unknown>
): CommentInDatabase[] =>
	querySnapshot.docs.map((doc) => {
		const docData = doc.data() as CommentInDatabase;
		const docReplies = (docData.replies || []) as CommentReply[];
		return {
			...docData,
			id: doc.id,
			resolvedAt: docData.resolvedAt
				? (docData.resolvedAt as Timestamp).toDate()
				: null,
			createdAt: (docData.createdAt as Timestamp).toDate(),
			updatedAt: (docData.updatedAt as Timestamp).toDate(),
			replies: docReplies.map((reply) => ({
				...reply,
				createdAt: (docData.createdAt as Timestamp).toDate(),
				updatedAt: (docData.updatedAt as Timestamp).toDate(),
			})),
		};
	});

interface Filters {
	maxX: number;
	maxY: number;
	user: string;
}
export const getCommentsForPageQueryRef = (filters?: Filters) => {
	const { user } = filters || {};

	const url = window.location.origin + window.location.pathname;
	const collectionRef = collection(
		getFirestore(),
		COMMENTS_FIRESTORE_COLLECTION_NAME
	);

	const { currentSiteVersion } = configStore.get();

	const queryArgs: [
		query: Query<unknown>,
		...queryConstraints: QueryConstraint[]
	] = [collectionRef, where("url", "==", url)];

	if (currentSiteVersion)
		queryArgs.push(where("siteVersion", "==", currentSiteVersion));
	if (user) queryArgs.push(where("user", "==", user));

	const queryRef = query(...queryArgs);

	return queryRef;
};

export const getCommentsForPage = async (filters: Filters) => {
	try {
		const queryRef = getCommentsForPageQueryRef(filters);
		const commentDocs = await getDocs(queryRef);
		const processedDocs = processCommentDocs(commentDocs);
		return { data: processedDocs };
	} catch (error: Error | unknown) {
		return { error };
	}
};

export const createCommentForPage = async (data: CommentInDatabase) => {
	try {
		const collectionRef = collection(
			getFirestore(),
			COMMENTS_FIRESTORE_COLLECTION_NAME
		);
		const commentDocRef = doc(collectionRef);
		await setDoc(commentDocRef, data);
		return { data: commentDocRef };
	} catch (error: Error | unknown) {
		return { error };
	}
};

export const deleteComment = async (commentId: string) => {
	try {
		const collectionRef = collection(
			getFirestore(),
			COMMENTS_FIRESTORE_COLLECTION_NAME
		);
		const commentDocRef = doc(collectionRef, commentId);
		await deleteDoc(commentDocRef);
		return { data: commentDocRef };
	} catch (error: Error | unknown) {
		return { error };
	}
};

export const addReplyToComment = async (
	commentId: string,
	replyData: CommentReply
) => {
	try {
		const collectionRef = collection(
			getFirestore(),
			COMMENTS_FIRESTORE_COLLECTION_NAME
		);
		const commentDocRef = doc(collectionRef, commentId);
		const replyUniqueId = doc(collectionRef).id; // Random document generated to get a unique ID for the reply.
		await updateDoc(commentDocRef, {
			replies: arrayUnion({
				...replyData,
				id: replyUniqueId,
				createdAt: new Date(),
				updatedAt: new Date(),
			}),
		});
		return { data: commentDocRef };
	} catch (error: Error | unknown) {
		return { error };
	}
};

export const deleteReplyToComment = async (
	commentId: string,
	replyId: string
) => {
	try {
		const collectionRef = collection(
			getFirestore(),
			COMMENTS_FIRESTORE_COLLECTION_NAME
		);
		const commentDocRef = doc(collectionRef, commentId);

		await runTransaction(getFirestore(), async (transaction) => {
			const commentDoc = await transaction.get(commentDocRef);
			if (!commentDoc.exists()) throw new Error("Comment not found.");

			const updates = {
				replies: (commentDoc.data() as CommentInDatabase).replies.filter(
					(reply) => reply.id !== replyId
				),
				updatedAt: new Date(),
			};
			transaction.update(commentDocRef, updates);
		});
		return { data: commentDocRef };
	} catch (error: Error | unknown) {
		return { error };
	}
};

export const markCommentAsResolved = async (commentId: string) => {
	try {
		const collectionRef = collection(
			getFirestore(),
			COMMENTS_FIRESTORE_COLLECTION_NAME
		);
		const commentDocRef = doc(collectionRef, commentId);
		await updateDoc(commentDocRef, { resolved: true, resolvedAt: new Date() });
		return { data: commentDocRef };
	} catch (error: Error | unknown) {
		return { error };
	}
};

export const unresolveComment = async (commentId: string) => {
	try {
		const collectionRef = collection(
			getFirestore(),
			COMMENTS_FIRESTORE_COLLECTION_NAME
		);
		const commentDocRef = doc(collectionRef, commentId);
		await updateDoc(commentDocRef, { resolved: false, resolvedAt: null });
		return { data: commentDocRef };
	} catch (error: Error | unknown) {
		return { error };
	}
};
