import getElementOffsetLeft from "./getElementOffsetLeft";
import getElementOffsetTop from "./getElementOffsetTop";

const getPositionRelativeToElement = (
	element: HTMLElement,
	x: number,
	y: number
) => {
	const relativeLeftPercentage = x / getElementOffsetLeft(element);
	const relativeTopPercentage = y / getElementOffsetTop(element);
	return {
		relativeLeftPercentage,
		relativeTopPercentage,
	};
};

export default getPositionRelativeToElement;
