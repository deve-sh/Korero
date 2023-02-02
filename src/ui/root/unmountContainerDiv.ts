import getContainerDiv from "./getContainerDiv";

const unmountContainerDiv = () => {
	const existingContainerDiv = getContainerDiv();
	if (!existingContainerDiv) return;
	existingContainerDiv.remove();
};

export default unmountContainerDiv;
