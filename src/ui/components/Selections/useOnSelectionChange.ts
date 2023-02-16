import { useEffect } from "react";
import useCurrentDOMSelectionRangeCount from "../../state/currentDOMSelectionRangeCount";

let debounceTimeout: NodeJS.Timeout;

const useOnDOMSelectionChange = () => {
	const [, setCurrentSelectionRangeCount] = useCurrentDOMSelectionRangeCount();

	useEffect(() => {
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
	}, []);
};

export default useOnDOMSelectionChange;
