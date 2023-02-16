import { useMemo } from "react";
import useCurrentDOMSelectionRangeCount from "../../state/currentDOMSelectionRangeCount";
import SelectionRectangle from "./SelectionRectangle";

const RenderSelectionDivs = () => {
	const [currentSelectionRangeCount] = useCurrentDOMSelectionRangeCount();

	const rangeClientRects = useMemo(() => {
		if (!currentSelectionRangeCount) return [];

		const currentSelection = window.getSelection();
		if (!currentSelection) return [];

		const selectionRange = currentSelection.getRangeAt(0);
		if (!selectionRange) return [];

		const rects = Array.from(selectionRange.getClientRects());

		return rects;
	}, [currentSelectionRangeCount]);

	return rangeClientRects.length ? (
		<>
			{rangeClientRects.map((rect, index) => {
				const props = {
					x: rect.x,
					y: rect.y,
					top: rect.top,
					bottom: rect.bottom,
					left: rect.left,
					right: rect.right,
					width: rect.width,
					height: rect.height,
				};
				return <SelectionRectangle key={index + rect.x} {...props} />;
			})}
		</>
	) : (
		<></>
	);
};

export default RenderSelectionDivs;
