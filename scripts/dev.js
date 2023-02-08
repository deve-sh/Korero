const liveServer = require("live-server");
const { exec } = require("child_process");
const chokidar = require("chokidar");
const { writeFileSync } = require("fs");

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
		<script type="text/javascript" src="../dist/index.js"></script>
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

const printExecResult = (error, stdout, stderr) => {
	console.log(error);
	console.log(stdout);
	console.log(stderr);
};

writeFileSync("./dev/index.html", HTMLFileTemplate);
chokidar.watch("./src").on("change", (path) => {
	console.log(
		"Change in file: ",
		path,
		", rebuilding app, this usually takes 1-8 seconds."
	);
	exec("npm run build", printExecResult);
});

// Create a build and start the live server.
exec("npm run build", printExecResult); // Initial build
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
console.log("Live Server started at: http://localhost:5500/dev/index.html");
