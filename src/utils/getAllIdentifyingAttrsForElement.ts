export const getElementUniqueSelector = (element: HTMLElement | Element) => {
	const path: string[] = [];
	let parent: ParentNode | null;

	while ((parent = element.parentNode)) {
		const children = Array.from(parent.children);
		const elementIndex = children.indexOf(element);
		path.unshift(
			`${element.tagName}${
				elementIndex ? `:nth-child(${elementIndex + 1})` : ""
			}`
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
