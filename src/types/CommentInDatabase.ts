import type { Timestamp } from "firebase/firestore";
import type User from "./User";

export default interface CommentInDatabase {
	id?: string;
	url?: string;
	user: User;
	resolved?: boolean;
	resolvedAt?: Date | Timestamp | null;
	resolvedBy?: string; // Firebase Auth uuid
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
	user: User;
	content: string;
	createdAt?: Date | Timestamp;
	updatedAt?: Date | Timestamp;
}
