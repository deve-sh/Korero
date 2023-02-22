// Why not just get the cursor position instead of the anchor?
// Because selections can even happen via keyboard as well.

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
