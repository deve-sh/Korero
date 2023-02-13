import Korero from "../index";

/**
 * This is a simple closure function to store the current instance of the Korero class.
 * Usage: koreroInstanceStore.set(...), const instance = koreroInstanceStore.get();
 */
const koreroInstanceStore = () => {
	let storedInstance: Korero;

	return {
		set(instance: Korero) {
			storedInstance = instance;
		},
		get() {
			return storedInstance || null;
		},
	};
};

export default koreroInstanceStore();
