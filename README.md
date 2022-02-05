Flutter Versioning
===
Works on a dart version & build number string: `<semantic version>+<build number>`

e.g. 1.0.0+1

Designed for mobile application targets and will ensure each new build can successfully be uploaded to both the Google Play Store and the Apple App Store.

## Version string 
Updates the version string in target pubspec.yaml files to: <year>.<week>.<day><count>+<increment>

For example, the version string of the first build on the Monday of Week 5 (ISO week) in 2022 would be:
```
2022.5.101
```
The second build would be:
```
2022.5.102
```
CAVEAT: This has a fundamental limitation of being only able to run 99 builds in the same day

