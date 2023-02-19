import { atom, useAtom } from "jotai";

const expandedCommentThreadIdAtom = atom<string | null>(null);

const useExpandedCommentThreadId = () => useAtom(expandedCommentThreadIdAtom);

export default useExpandedCommentThreadId;
