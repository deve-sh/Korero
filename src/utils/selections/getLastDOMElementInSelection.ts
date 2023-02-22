const getLastDOMElementInSelection = (parent?: Element): Element | null => {
	let lastElementInSelection = parent;

	if (!lastElementInSelection) {
		const selection = window.getSelection();
		if (!selection || !selection.rangeCount || selection.type === "Caret")
			return null;

		const range = selection.getRangeAt(0);
		if (!range || !range.commonAncestorContainer) return null;

		lastElementInSelection = Array.from(
			(range.commonAncestorContainer as HTMLElement).children || []
		).pop();
	}

	if (!lastElementInSelection) return null;
	if (lastElementInSelection.children.length)
		return getLastDOMElementInSelection(lastElementInSelection);

	return lastElementInSelection;
};

export default getLastDOMElementInSelection;
