// Algorithm:
// If the range received from a selection object, has a startContainer with nodeType != 1 (For a regular element with a tag)
// then get the parent element and store the offset of the node with respect to it and the unique selector of the parent.
// else store the unique selector of the element.
// Do the same for both start and end of the range, stringify them and store them in the database.

// Some interesting refs:
// Ref: https://www.npmjs.com/package/serialize-selection
// Ref: https://stackoverflow.com/questions/48810664/get-click-range-relative-to-parent-element

import { getElementUniqueSelector } from "../getAllIdentifyingAttrsForElement";
import getParentElementOfSpecialNode from "./getParentElementOfSpecialNode";

interface SerializedRangeElementProperty {
	element: string;
	isSpecialNode: boolean;
	indexInParent: number;
	rangeOffset: number;
}

const calculateRangePropertiesForNode = (
	node: Node,
	offset: number
): SerializedRangeElementProperty => {
	if (node.nodeType !== 1) {
		const parentElement = getParentElementOfSpecialNode(node) as Element;
		return {
			element: getElementUniqueSelector(parentElement),
			isSpecialNode: true,
			indexInParent: Array.from(parentElement.childNodes).findIndex(
				(node) => node === node
			),
			rangeOffset: offset,
		};
	} else {
		return {
			element: getElementUniqueSelector(node as Element),
			isSpecialNode: false,
			indexInParent: -1,
			rangeOffset: offset,
		};
	}
};

export const serializeSelectionRange = () => {
	const selection = window.getSelection();
	if (!selection || !selection.rangeCount || selection.type === "Caret") return;

	const range = selection.getRangeAt(0);
	if (!range) return;

	const start = calculateRangePropertiesForNode(
		range.startContainer,
		range.startOffset
	);
	const end = calculateRangePropertiesForNode(
		range.endContainer,
		range.endOffset
	);

	return { start, end };
};

export const deserializeAndApplySelectionRange = (serializedRange: {
	start: SerializedRangeElementProperty;
	end: SerializedRangeElementProperty;
}) => {
	const range = new Range();

	const startElementProps =
		serializedRange.start as SerializedRangeElementProperty;
	const endElementProps = serializedRange.end as SerializedRangeElementProperty;

	if (!startElementProps || !endElementProps) return;

	let rangeStartContainer = document.querySelector(startElementProps.element);
	let rangeEndContainer = document.querySelector(endElementProps.element);

	if (!rangeStartContainer || !rangeEndContainer) return;

	// If the nodes that were selected were text or special nodes
	if (startElementProps.isSpecialNode) {
		rangeStartContainer = Array.from(rangeStartContainer.childNodes).at(
			startElementProps.indexInParent
		) as Element;
	}

	if (endElementProps.isSpecialNode) {
		rangeEndContainer = Array.from(rangeEndContainer.childNodes).at(
			endElementProps.indexInParent
		) as Element;
	}

	if (!rangeStartContainer || !rangeEndContainer) return;

	// All validations done.

	try {
		range.setStart(rangeStartContainer, startElementProps.rangeOffset);
		range.setEnd(rangeEndContainer, endElementProps.rangeOffset);
		window.getSelection()?.addRange(range);
	} catch {}
};
