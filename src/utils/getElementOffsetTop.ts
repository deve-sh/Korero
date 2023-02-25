const getElementOffsetTop = (element: HTMLElement): number => {
	const box = element.getBoundingClientRect();
	return (
		document.body.scrollTop +
		box.top +
		window.pageYOffset -
		document.documentElement.clientTop
	);
};

export default getElementOffsetTop;
