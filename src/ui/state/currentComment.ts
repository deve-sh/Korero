import { atom, useAtom } from "jotai";

export interface CurrentComment {
	element: {
		attributeBasedSelector: string;
		selector: string;
		x?: string | number; // Offset percentages/numbers inside the target element.
		y?: string | number;
	};
	content: string;
	user: {
		uid?: string;
		displayName?: string;
		photoURL?: string;
		email?: string;
		phoneNumber?: string;
	};
}

const currentComment = atom<CurrentComment | null>(null);

const useCurrentComment = () => useAtom(currentComment);

export default useCurrentComment;
