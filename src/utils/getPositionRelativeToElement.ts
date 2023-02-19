const getPositionRelativeToElement = (
	element: HTMLElement,
	x: number,
	y: number
) => {
	const relativeLeft = x - element.offsetLeft;
	const relativeTop = y - element.offsetTop;
	const relativeLeftPercentage = relativeLeft / element.clientWidth;
	const relativeTopPercentage = relativeTop / element.clientHeight;
	return {
		relativeLeft,
		relativeTop,
		relativeLeftPercentage,
		relativeTopPercentage,
	};
};

export default getPositionRelativeToElement;
