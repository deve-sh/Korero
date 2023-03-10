import isValidSelection from "./isValidSelection";

const getContentFromDOMSelection = () => {
	const selection = window.getSelection();
	if (!selection || !isValidSelection()) return null;

	const range = selection.getRangeAt(0);
	if (!range) return null;

	const content = selection.toString();
	if (content.length > 100) return content.slice(0, 100) + "...";

	return content;
};

export default getContentFromDOMSelection;
