import { atom, useAtom } from "jotai";

const currentDOMSelectionRangeCountAtom = atom<number | null>(null);

const useCurrentDOMSelectionRangeCount = () =>
	useAtom(currentDOMSelectionRangeCountAtom);

export default useCurrentDOMSelectionRangeCount;
