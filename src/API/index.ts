import {
	collection,
	query,
	where,
	getDocs,
	type Query,
	type QueryConstraint,
	type QuerySnapshot,
} from "firebase/firestore";
import getFirestore from "../firebase/firestore";

import type CommentInDatabase from "../types/CommentInDatabase";

const processCommentDocs = (
	querySnapshot: QuerySnapshot<unknown>
): CommentInDatabase[] =>
	querySnapshot.docs.map((doc) => ({
		...(doc.data() as CommentInDatabase),
		id: doc.id,
	}));

interface Filters {
	maxX: number;
	maxY: number;
	user: string;
}
export const getCommentsForPageQueryRef = ({ maxX, maxY, user }: Filters) => {
	const url = window.location.origin + window.location.pathname;
	const collectionRef = collection(getFirestore(), "korero-comments");

	const queryArgs: [
		query: Query<unknown>,
		...queryConstraints: QueryConstraint[]
	] = [collectionRef, where("url", "==", url)];

	if (maxX) queryArgs.push(where("metadata.x", "<=", maxX));
	if (maxY) queryArgs.push(where("metadata.y", "<=", maxY));
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
