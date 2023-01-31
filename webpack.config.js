const path = require("path");

module.exports = {
	entry: "./dist/index.js",
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "index.js",
		libraryExport: "default",
		library: "korero",
		libraryTarget: "umd",
		globalObject: "this",
	},
};
