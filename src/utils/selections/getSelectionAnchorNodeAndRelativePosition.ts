import getPositionRelativeToElement from "../getPositionRelativeToElement";
import getLastDOMElementInSelection from "./getLastDOMElementInSelection";

const getSelectionAnchorNodeAndRelativePosition = () => {
	const lastElementInSelection = getLastDOMElementInSelection() as HTMLElement;
	if (!lastElementInSelection) return null;

	const lastRangeSelectionDiv = document.querySelector(
		"range-selection-div:last-child"
	);
	if (!lastRangeSelectionDiv) return null;

	const lastRangeSelectionDivEndpoints = Array.from(
		lastRangeSelectionDiv.getClientRects()
	).pop();
	if (!lastRangeSelectionDivEndpoints) return null;

	const positionRelativeToAnchorNode = getPositionRelativeToElement(
		lastElementInSelection,
		lastRangeSelectionDivEndpoints.x,
		lastRangeSelectionDivEndpoints.y
	);
};

export default getSelectionAnchorNodeAndRelativePosition;
