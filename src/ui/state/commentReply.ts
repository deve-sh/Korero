import { atom } from "jotai";
import { useAtom } from "jotai";

const commentReplyContentAtom = atom<string>("");

const useCommentReplyContent = () => useAtom(commentReplyContentAtom);

export default useCommentReplyContent;
