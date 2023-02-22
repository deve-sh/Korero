const isValidSelection = () => {
	return (
		window.getSelection()?.rangeCount && window.getSelection()?.type !== "Caret"
	);
};

export default isValidSelection;
