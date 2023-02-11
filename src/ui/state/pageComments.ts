import { atom, useAtom } from "jotai";
import type CommentInDatabase from "../../types/CommentInDatabase";

const pageComments = atom<CommentInDatabase[]>([]);

const usePageCommentsStore = () => useAtom(pageComments);

export default usePageCommentsStore;
