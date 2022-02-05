const {
  extractBuildAndVersion,
  generateNewVersion,
  updateVersionInPubspecYamlString,
  updateVersionInPubspecs,
} = require("./flutter-versioning");

// for local testing only
describe("updateVersionInPubspecs", () => {
  it("should update the version in the given pubspec yaml files", () => {
    updateVersionInPubspecs({ path: "./test-files/pubspec.yaml" });
  });
});

describe("updateVersionInPubspecYamlString", () => {
  it("should update the version line in a pubspec yaml string", () => {
    const before = `
name: dummy_pubspec
description: "For testing version numbers"
publish_to: 'none' # Remove this line if you wish to publish to pub.dev
version: 2022.4.509+9

environment:
  sdk: ">=2.14.0 <3.0.0"

dependencies:
  flutter:
    sdk: flutter

flutter:

  # The following line ensures that the Material Icons font is
  # included with your application, so that you can use the icons in
  # the material Icons class.
  uses-material-design: true
`.trim();
    const year = "2022";
    const weekNumber = "4";
    const dayOfWeek = "5";

    const { updatedYamlString } = updateVersionInPubspecYamlString({
      yamlString: before,
      year,
      weekNumber,
      dayOfWeek,
    });

    expect(updatedYamlString).toStrictEqual(
      `
name: dummy_pubspec
description: "For testing version numbers"
publish_to: 'none' # Remove this line if you wish to publish to pub.dev
version: 2022.4.510+10

environment:
  sdk: ">=2.14.0 <3.0.0"

dependencies:
  flutter:
    sdk: flutter

flutter:

  # The following line ensures that the Material Icons font is
  # included with your application, so that you can use the icons in
  # the material Icons class.
  uses-material-design: true
`.trim(),
    );
  });
  it("should return newVersion and newBuild", () => {
    const before = `
name: dummy_pubspec
description: "For testing version numbers"
publish_to: 'none' # Remove this line if you wish to publish to pub.dev
version: 2022.4.509+9
`.trim();
    const year = "2022";
    const weekNumber = "4";
    const dayOfWeek = "5";

    const { newVersion, newBuild } = updateVersionInPubspecYamlString({
      yamlString: before,
      year,
      weekNumber,
      dayOfWeek,
    });
    expect(newVersion).toBe("2022.4.510");
    expect(newBuild).toBe(10);
  });
});

describe("extractBuildAndVersion", () => {
  it("should handle untrimmed", () => {
    expect(extractBuildAndVersion({ line: " version: 1.0.0+0" })).toStrictEqual(
      { version: "1.0.0", build: 0 },
    );
  });
  it("should return a build number of 1 when no build number set with plus symbol", () => {
    expect(
      extractBuildAndVersion({ line: " version: 2022.5.60+" }),
    ).toStrictEqual({ version: "2022.5.60", build: 1 });
  });
  it("should return a build number of 1 when no build number set without plus symbol", () => {
    expect(
      extractBuildAndVersion({ line: " version: 2022.5.60" }),
    ).toStrictEqual({ version: "2022.5.60", build: 1 });
  });
  it("should return an empty string for the version when nothing to the left of the plus symbol", () => {
    expect(extractBuildAndVersion({ line: " version: +1" })).toStrictEqual({
      version: "",
      build: 1,
    });
  });
});

describe("generateNewVersion", () => {
  it("should handle empty oldVersion: '' -> 2022.5.301", () => {
    const oldVersion = "";
    const yearWeekDayOfWeek = "2022.5.3";

    expect(generateNewVersion({ oldVersion, yearWeekDayOfWeek })).toBe(
      `${yearWeekDayOfWeek}01`,
    );
  });
  it("should handle poorly formed oldVersion on the same day: 2022.30.1 -> 2022.30.101", () => {
    const oldVersion = "2022.30.1";
    const yearWeekDayOfWeek = "2022.30.1";
    expect(generateNewVersion({ oldVersion, yearWeekDayOfWeek })).toBe(
      `${yearWeekDayOfWeek}01`,
    );
  });
  it("should handle poorly formed oldVersion on the next day: 2022.30.1 -> 2022.30.201", () => {
    const oldVersion = "2022.30.1";
    const yearWeekDayOfWeek = "2022.30.2";
    expect(generateNewVersion({ oldVersion, yearWeekDayOfWeek })).toBe(
      `${yearWeekDayOfWeek}01`,
    );
  });
  it("should increment final number on same day: 2022.11.301 -> 2022.11.302", () => {
    const oldVersion = "2022.11.301";
    const yearWeekDayOfWeek = "2022.11.3";
    expect(generateNewVersion({ oldVersion, yearWeekDayOfWeek })).toBe(
      `${yearWeekDayOfWeek}02`,
    );
  });
});
