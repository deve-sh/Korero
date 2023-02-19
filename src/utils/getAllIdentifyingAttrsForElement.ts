export const getElementUniqueSelector = (element: HTMLElement | Element) => {
	const path: string[] = [];
	let parent: ParentNode | null;

	while ((parent = element.parentNode)) {
		path.unshift(
			`${element.tagName}:nth-child(${
				Array.from(parent.children).indexOf(element) + 1
			})`
		);
		element = parent as HTMLElement;
	}

	const selector = path.join(" > ").toLowerCase();
	return selector;
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
