import type { Timestamp } from "firebase/firestore";

export default interface CommentInDatabase {
	id?: string;
	user: {
		email?: string;
		displayName?: string;
		phoneNumber?: string;
		photoURL?: string;
		uid?: string;
	};
	element: {
		selector: string;
		attributeBasedSelector: string;
	};
	position: {
		x?: number;
		y?: number;
		relative: {
			relativeLeft?: number;
			relativeTop?: number;
			relativeLeftPercentage?: number;
			relativeTopPercentage?: number;
		};
	};
	content: string;
	siteVersion?: string;
	replies: CommentReply[];
	createdAt: Date | Timestamp;
	updatedAt: Date | Timestamp;
}

export interface CommentReply {
	id?: string;
	user: {
		email?: string;
		displayName?: string;
		phoneNumber?: string;
		photoURL?: string;
		uid?: string;
	};
	content: string;
	createdAt: Date | Timestamp;
	updatedAt: Date | Timestamp;
}
