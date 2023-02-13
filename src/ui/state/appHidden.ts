import { atom } from "jotai";
import { useAtom } from "jotai";

const appHiddenAtom = atom<boolean>(false);

const useAppHidden = () => useAtom(appHiddenAtom);

export default useAppHidden;
