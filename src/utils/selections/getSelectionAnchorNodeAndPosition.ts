import getPositionRelativeToElement from "../getPositionRelativeToElement";
import getLastDOMElementInSelection from "./getLastDOMElementInSelection";

const getSelectionAnchorNodeAndSelectionOffset = ():
	| [HTMLElement, { x: number; y: number }]
	| null => {
	const lastElementInSelection = getLastDOMElementInSelection() as HTMLElement;
	if (!lastElementInSelection) return null;

	const lastRangeSelectionDiv = document.querySelector(
		".range-selection-div:last-child"
	);
	if (!lastRangeSelectionDiv) return null;

	const lastRangeSelectionDivEndpoints = Array.from(
		lastRangeSelectionDiv.getClientRects()
	).pop();
	if (!lastRangeSelectionDivEndpoints) return null;

	return [
		lastElementInSelection,
		{
			x: lastRangeSelectionDivEndpoints.right,
			y: lastRangeSelectionDivEndpoints.bottom,
		},
	];
};

export default getSelectionAnchorNodeAndSelectionOffset;
