const cp = require("child_process");
const path = require("path");

// shows how the runner will run a javascript action with env / stdout protocol
test("test runs", () => {
  process.env["INPUT_PUBSPEC_PATH"] = "./test-files/pubspec.yaml";
  const ip = path.join(__dirname, "index.js");
  console.log("ip: ", ip);

  const resNpmVersion = cp.execSync("node -v");
  console.log("success", resNpmVersion.toString());

  const result = cp.execSync(`node ${ip}`, { env: process.env }).toString();
  console.log(result);
});
