const getParentElementOfSpecialNode = (node: Node) => {
	if (node.nodeType === 3) return node.parentElement;
	return node;
};

export default getParentElementOfSpecialNode;
