import type { Timestamp } from "firebase/firestore";
import type User from "./User";
import type RelativeDeviceInfo from "./RelevantDeviceInfo";
import type { SerializedRangeElementProperty } from "../utils/selections/serializeAndRestoreSelection";

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
	// properties exclusively for comments on top of selections or notes
	isNote?: boolean;
	selectionRange?: {
		start: SerializedRangeElementProperty;
		end: SerializedRangeElementProperty;
	} | null;
	attachedNoteExcerpt?: string;
}

export interface CommentReply {
	id?: string;
	user: User;
	content: string;
	device?: RelativeDeviceInfo;
	createdAt?: Date | Timestamp;
	updatedAt?: Date | Timestamp;
}
