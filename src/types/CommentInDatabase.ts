import type { Timestamp } from "firebase/firestore";
import type User from "./User";
import type RelativeDeviceInfo from "./RelevantDeviceInfo";

export default interface CommentInDatabase {
	id?: string;
	url?: string;
	user: User;
	resolved?: boolean;
	resolvedAt?: Date | Timestamp | null;
	element: {
		selector: string;
		attributeBasedSelector: string;
	};
	device?: RelativeDeviceInfo;
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
	device?: RelativeDeviceInfo;
	createdAt?: Date | Timestamp;
	updatedAt?: Date | Timestamp;
}
