// Some reading material:
// https://davidfurlong.me/creating-unique-stable-selectors-dom-elements
// https://chromium.googlesource.com/chromium/blink/+/master/Source/devtools/front_end/components/DOMPresentationUtils.js
// Long story short: There is no reliable way to generate a unique selector given the plethora of DOM manipulating libraries like React.

import { finder as elementUniqueSelectorGenerator } from "@medv/finder";

export const getElementUniqueSelector = (element: HTMLElement | Element) => {
	// // Old code generated a body > div:nth-child(2) > div:nth-child(4) > div:nth-child(1) like selector.
	// const path: string[] = [];
	// let parent: ParentNode | null;
	// while ((parent = element.parentNode)) {
	// 	const children = Array.from(parent.children);
	// 	const elementIndex = children.indexOf(element);
	// 	path.unshift(
	// 		`${element.tagName}${
	// 			elementIndex ? `:nth-child(${elementIndex + 1})` : ""
	// 		}`
	// 	);
	// 	element = parent as HTMLElement;
	// }
	// const selector = path.join(" > ").toLowerCase();
	// return selector;

	return elementUniqueSelectorGenerator(element);
};

const getAllIdentifyingAttributesForElement = (element: HTMLElement) => {
	const attributes = Array.from(element.attributes).map((attribute) => ({
		name: attribute.name,
		value: attribute.value,
	}));
	const elementUniqueSelector = getElementUniqueSelector(element);
	const attributeBasedSelector = (
		`${element.tagName}` +
		attributes.map((attribute) => `[${attribute.name}="${attribute.value}"]`)
	).toLowerCase();

	return {
		selector: elementUniqueSelector,
		attributes,
		attributeBasedSelector,
	};
};

export default getAllIdentifyingAttributesForElement;
