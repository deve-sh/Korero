const getElementOffsetLeft = (element?: HTMLElement): number => {
	if (!element) return 0;
	return (
		getElementOffsetLeft(element.offsetParent as HTMLElement) +
		element.offsetLeft
	);
};

export default getElementOffsetLeft;
