import { atom, useAtom } from "jotai";

import { type SerializedRangeElementProperty } from "../../utils/selections/serializeAndRestoreSelection";

export interface CurrentComment {
	element: {
		attributeBasedSelector: string;
		selector: string;
	};
	position: {
		x: number;
		y: number;
	};
	content: string;
	user: {
		uid?: string;
		displayName?: string;
		photoURL?: string;
		email?: string;
		phoneNumber?: string;
	};
	// properties exclusively for comments on top of selections or notes
	isNote?: boolean;
	selectionRange?: {
		start: SerializedRangeElementProperty;
		end: SerializedRangeElementProperty;
	};
	attachedNoteExcerpt?: string;
}

const currentComment = atom<CurrentComment | null>(null);

const useCurrentComment = () => useAtom(currentComment);

export default useCurrentComment;
