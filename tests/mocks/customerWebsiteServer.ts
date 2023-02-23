import path from "path";
const express = require("express");

const setupMockCustomerWebsiteServer = () =>
	new Promise((resolve) => {
		const serverApp = express();

		serverApp.get("/", (_, res) =>
			res.sendFile(path.resolve(__dirname, "index.html"))
		);
		serverApp.get("/umd.js", (_, res) =>
			res.sendFile(path.resolve(__dirname, "../../dist/umd.js"))
		);

		const server = serverApp.listen(5050);

		resolve(server);
	});

export default setupMockCustomerWebsiteServer;
