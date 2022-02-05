const { DateTime } = require("luxon");
const fs = require("fs");

function updateVersionInPubspecs({ path }) {
  const yamlString = fs.readFileSync(path, "utf8").toString();

  const now = DateTime.now();
  const year = now.year;
  const weekNumber = now.weekNumber;
  const dayOfWeek = now.weekday;

  const { updatedYamlString, newVersion, newBuild } =
    updateVersionInPubspecYamlString({
      yamlString,
      year,
      weekNumber,
      dayOfWeek,
    });

  fs.writeFileSync(path, updatedYamlString, "utf8");

  return {
    path,
    newVersion,
    newBuild,
  };
}

function updateVersionInPubspecYamlString({
  yamlString,
  year,
  weekNumber,
  dayOfWeek,
}) {
  let newVersion;
  let newBuild;

  const updatedYamlString = yamlString
    .split("\n")
    .map((line) => {
      // -- is this the version line
      const trimmed = line.trimLeft();
      const versionPrefix = "version:";
      if (!trimmed.startsWith(versionPrefix)) return line;

      // -- find the current version number
      const { version, build } = extractBuildAndVersion({
        versionPrefix,
        line: trimmed,
      });

      // -- construct the new version number prefix (not including increment)
      const yearWeekDayOfWeek = `${year}.${weekNumber}.${dayOfWeek}`;
      newVersion = generateNewVersion({
        oldVersion: version,
        yearWeekDayOfWeek,
      });

      newBuild = build + 1;

      return `${versionPrefix} ${newVersion}+${newBuild}`;
    })
    .join("\n");

  return { updatedYamlString, newVersion, newBuild };
}

// requires a valid version line from a pubspec.yaml
//
// input: version: 2022.5.6+0
// output: { version: "2022.5.6", build: 0 }
function extractBuildAndVersion({ versionPrefix = "version:", line }) {
  const split = line
    .trim()
    .split(versionPrefix)
    // if the version doesn't have a value set `split` will
    // return a value of `['', '']`
    .filter((it) => it != null && it.trim().length);

  // just in case ' 1.0.0+1 '
  const versionAndBuild = (split[0] || "").trim();
  if (!versionAndBuild.length) return line;

  // note: maybeBuild might be null
  let [version, build] = versionAndBuild.split("+");
  build = parseInt(build || "1");

  return {
    version,
    build,
  };
}

function generateNewVersion({ oldVersion, yearWeekDayOfWeek }) {
  // -- what if oldVersion doesn't have the final digit
  // e.g. oldVersion = 2022.5.6
  if (oldVersion === yearWeekDayOfWeek) {
    // in 2022.5.6, out 2022.5.60
    // will work since 60 > 6
    return `${yearWeekDayOfWeek}01`;
  }

  // -- do we need to increment the final digit?
  // e.g. version = 2022.5.60, newVersionStart = 2022.5.6
  if (oldVersion.startsWith(yearWeekDayOfWeek)) {
    let [major, minor, patch] = oldVersion.split(".");

    const [day, ...incrementParts] = patch.split("");
    const increment = incrementParts.join("");

    // grab the first two parts [2022, 5] then
    return `${major}.${minor}.${day}${String(parseInt(increment) + 1).padStart(
      2,
      "0",
    )}`;
  }

  return `${yearWeekDayOfWeek}01`;
}

module.exports = {
  updateVersionInPubspecs,
  updateVersionInPubspecYamlString,
  generateNewVersion,
  extractBuildAndVersion,
};
