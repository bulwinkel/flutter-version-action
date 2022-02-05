const core = require("@actions/core");
const { updateVersionInPubspecs } = require("./flutter-versioning");
const fs = require("fs");

// most @actions toolkit packages have async methods
async function run() {
  try {
    const path = core.getInput("pubspec_path");
    core.info(`pubspec_path: ${path}`);

    const { newVersion, newBuild } = updateVersionInPubspecs({ path });
    core.info(`Version successfully updated in ${path}`);
    core.info("----");
    core.info(`new_version: ${newVersion}`);
    core.info(`new_build: ${newBuild}`);
    core.info("----");
    core.info(fs.readFileSync(path, "utf8").toString());

    core.setOutput("new_version", newVersion);
    core.setOutput("new_build", newBuild);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
