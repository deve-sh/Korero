import { atom, useAtom } from "jotai";

export const isCommentingOnState = atom<boolean>(false);

const useIsCommentingOn = () => useAtom(isCommentingOnState);
export default useIsCommentingOn;
