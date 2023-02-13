import Korero from "../index";

const mountLocationChangeInitializers = (koreroInstance: Korero) => {
	window.addEventListener("popstate", () => {
		// URL changed. Unmount and remount korero
		koreroInstance.unmount();
		koreroInstance.initialize();
	});
};

export default mountLocationChangeInitializers;
