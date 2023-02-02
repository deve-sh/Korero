import { createRoot, type Root as ReactRoot } from "react-dom/client";

import getContainerDiv from "./root/getContainerDiv";
import mountContainerDiv from "./root/mountContainerDiv";
import unmountContainerDiv from "./root/unmountContainerDiv";

let root: ReactRoot;

export const mountUI = () => {
	let container = getContainerDiv();
	if (!container) mountContainerDiv();

	container = getContainerDiv() as HTMLElement;

	root = createRoot(container);
	root.render(<>Korero React App</>);
};

export const unmountUI = () => {
	if (!root) return;
	root.unmount();
	unmountContainerDiv();
};
