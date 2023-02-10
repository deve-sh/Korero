const liveServer = require("live-server");
const { execSync } = require("child_process");
const chokidar = require("chokidar");
const { mkdirSync, writeFileSync } = require("fs");
const open = require("open");

const firebaseCredentials =
	process.env.KORERO_FIREBASE_CREDENTIALS || process.argv[2];
const config = process.env.KORERO_CONFIG || process.argv[3];

if (!firebaseCredentials)
	throw new Error(
		"Korero Dev: Please add firebase credentials as a command line argument or FIREBASE_CREDENTIALS environment variable."
	);

const HTMLFileTemplate = `
<!DOCTYPE html>
<html lang="en">
	<head>
		<title>Korero - Try it out</title>
	</head>
	<body>
		<script type="text/javascript" src="../dist/umd.js"></script>
		<script defer>
			const k = new korero({
				firebaseCredentials: ${firebaseCredentials},
				options: ${
					config ||
					JSON.stringify({
						allowedSignInMethods: ["google", "github"],
					})
				},
			});
			k.initialize();
		</script>
	</body>
</html>
`;

let lastBuildEventTriggeredAt = null;
chokidar.watch("./src").on("change", (path) => {
	console.log(
		"Change in file: ",
		path,
		", rebuilding app, this usually takes 1-8 seconds."
	);
	if (
		!lastBuildEventTriggeredAt ||
		new Date().getTime() - lastBuildEventTriggeredAt > 2000
	) {
		lastBuildEventTriggeredAt = new Date().getTime();
		execSync("npm run build", { stdio: "inherit" });
	}
});

// Create a build and start the live server.

// Write index.html file.
try {
	mkdirSync("./dev");
} catch {}

writeFileSync("./dev/index.html", HTMLFileTemplate);

console.log("Creating initial build for dev server...");
execSync("npm run build", { stdio: "inherit" }); // Initial build
const liveServerParams = {
	port: 5500,
	host: "localhost",
	root: "./",
	open: false,
	ignore: "node_modules,src",
	file: "index.html",
	wait: 1000,
	logLevel: 2,
};
liveServer.start(liveServerParams);
const liveServerURL = "http://localhost:5500/dev/index.html";
console.log("Live Server started at: " + liveServerURL);
open(liveServerURL);
