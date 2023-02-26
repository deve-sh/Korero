const getCommonAncestorElementForSelection = () => {
	const selection = window.getSelection();
	if (!selection || !selection.rangeCount || selection.type === "Caret")
		return null;

	const range = selection.getRangeAt(0);
	if (!range || !range.commonAncestorContainer) return null;

	let commonAncestorContainer: HTMLElement | null | undefined =
		range.commonAncestorContainer as HTMLElement;

	let count = 0;
	while (commonAncestorContainer?.nodeType !== 1 && count < 10) {
		if (commonAncestorContainer?.parentElement)
			commonAncestorContainer = commonAncestorContainer.parentElement;
		count++;
	}

	return commonAncestorContainer?.nodeType !== 1
		? null
		: commonAncestorContainer;
};

export default getCommonAncestorElementForSelection;
