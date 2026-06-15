const path = require("path");
const { tests } = require("@iobroker/testing");

// The integration test harness installs the adapter in a temp directory.
// Keep engine checks non-blocking there so Node 18 CI jobs don't fail on transitive deps.
process.env.NPM_CONFIG_ENGINE_STRICT = "false";

// Run integration tests - See https://github.com/ioBroker/testing for a detailed explanation and further options
tests.integration(path.join(__dirname, ".."), {
	controllerVersion: "7.2.1",
});
