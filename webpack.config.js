const path = require("path");

module.exports = (mode) => {
	const config = {
		entry: "./dist/index.js",
		output: {
			path: path.resolve(__dirname, "dist"),
			filename: "umd.js",
			libraryExport: "default",
			library: "korero",
			libraryTarget: "umd",
			globalObject: "this",
		},
	};

	if (!mode.production)
		config.optimization = {
			removeAvailableModules: false,
			removeEmptyChunks: false,
			splitChunks: false,
		};

	return config;
};
