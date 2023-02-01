import getContainerDiv from "./getContainerDiv";

const mountContainerDiv = () => {
	if (getContainerDiv()) return;
	const containerDiv = document.createElement("div");
	containerDiv.setAttribute("id", "korero-container");
	document.body.appendChild(containerDiv);
};

export default mountContainerDiv;
