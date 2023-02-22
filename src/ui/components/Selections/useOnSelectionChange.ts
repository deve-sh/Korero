import { useEffect } from "react";
import useIsCommentingOn from "../../state/commenting";
import useCurrentDOMSelectionRangeCount from "../../state/currentDOMSelectionRangeCount";

let debounceTimeout: NodeJS.Timeout;

const useOnDOMSelectionChange = () => {
	const [isCommentingOn] = useIsCommentingOn();
	const [, setCurrentSelectionRangeCount] = useCurrentDOMSelectionRangeCount();

	useEffect(() => {
		if (isCommentingOn) {
			const onSelectionChange = () => {
				if (debounceTimeout) clearTimeout(debounceTimeout);
				debounceTimeout = setTimeout(() => {
					setCurrentSelectionRangeCount(window.getSelection()?.rangeCount || 0);
				}, 750);
			};
			document.addEventListener("selectionchange", onSelectionChange);
			return () => {
				document.removeEventListener("selectionchange", onSelectionChange);
			};
		}
	}, [isCommentingOn]);
};

export default useOnDOMSelectionChange;
