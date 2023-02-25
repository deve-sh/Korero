const getElementOffsetLeft = (element: HTMLElement): number => {
	const box = element.getBoundingClientRect();
	return (
		document.body.scrollLeft +
		box.left +
		window.pageXOffset -
		document.documentElement.clientLeft
	);
};

export default getElementOffsetLeft;
