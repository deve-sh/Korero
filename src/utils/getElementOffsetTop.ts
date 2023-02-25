const getElementOffsetTop = (element?: HTMLElement): number => {
	if (!element) return 0;
	return (
		getElementOffsetTop(element.offsetParent as HTMLElement) + element.offsetTop
	);
};

export default getElementOffsetTop;
