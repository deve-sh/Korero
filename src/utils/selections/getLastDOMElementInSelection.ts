import getCommonAncestorElementForSelection from "./getCommonAncestorElement";

const getLastDOMElementInSelection = (parent?: Element): Element | null => {
	let lastElementInSelection = parent;

	if (!lastElementInSelection) {
		// First pass of recursion
		const selection = window.getSelection();
		if (!selection || !selection.rangeCount || selection.type === "Caret")
			return null;

		const range = selection.getRangeAt(0);
		if (!range) return null;

		const commonAncestorContainer = getCommonAncestorElementForSelection();
		if (!commonAncestorContainer) return null;
		if (!commonAncestorContainer.children.length)
			return commonAncestorContainer;

		lastElementInSelection = Array.from(
			commonAncestorContainer.children || []
		).pop() as Element;
	}

	return lastElementInSelection.children.length
		? getLastDOMElementInSelection(lastElementInSelection)
		: lastElementInSelection;
};

export default getLastDOMElementInSelection;
