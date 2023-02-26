const { execSync, exec } = require("child_process");
const chokidar = require("chokidar");

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
		const buildProcess = exec("npm run build:dev");
		buildProcess.stdout.on("data", console.log);
		buildProcess.stderr.on("data", console.error);
	}
});

console.log("Creating initial build");
execSync("npm run build:dev", { stdio: "inherit" }); // Initial build
