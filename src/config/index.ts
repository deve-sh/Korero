import Config from "../types/Config";

/**
 * This is a simple closure function to ensure that a config value passed from the constructor is made available to all other functions in the source code.
 * Usage: configStore.set(...), const options = configStore.get();
 */
const configStore = () => {
	let storedConfig: Config;

	return {
		set(config: Config) {
			storedConfig = config;
		},
		get() {
			return storedConfig;
		},
	};
};

export default configStore();
