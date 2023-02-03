const path = require("path");

module.exports = {
	entry: "./src/index.ts",
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "korero.js",
		libraryExport: "default",
		library: "korero",
		libraryTarget: "umd",
		globalObject: "this",
	},
	module: {
		rules: [
			{
				test: /\.(tsx|ts)$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: "babel-loader",
					options: {
						presets: [
							"@babel/preset-env",
							["@babel/preset-react", { runtime: "automatic" }],
						],
					},
				},
			},
			{ test: /\.(tsx|ts)?$/, use: "ts-loader" },
		],
	},
	resolve: {
		extensions: ["", ".ts", ".tsx"],
	},
};
