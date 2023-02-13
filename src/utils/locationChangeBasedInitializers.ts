import koreroInstanceStore from "../config/koreroInstanceStore";

const onLocationChange = () => () => {
	// URL changed. Unmount and remount korero
	const koreroInstance = koreroInstanceStore.get();
	if (!koreroInstance) return;
	koreroInstance.unmount();
	koreroInstance.initialize();
};

const mountLocationChangeInitializers = () => {
	window.addEventListener("popstate", onLocationChange);
	return () => window.removeEventListener("popstate", onLocationChange);
};

export default mountLocationChangeInitializers;
