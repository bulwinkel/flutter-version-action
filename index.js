const core = require("@actions/core");
const { updateVersionInPubspecs } = require("./flutter-versioning");

// most @actions toolkit packages have async methods
async function run() {
  try {
    const path = core.getInput("pubspec_path");
    core.info(`pubspec_path: ${path}`);

    const { newVersion, newBuild } = updateVersionInPubspecs({ path });

    core.setOutput("new_version", newVersion);
    core.setOutput("new_build", newBuild);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
