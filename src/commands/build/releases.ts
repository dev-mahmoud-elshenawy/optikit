import { executeBuild } from "../../utils/helpers/build.js";
import { BUILD_CONFIGS } from "../../constants.js";

export {
  buildFlutterApk,
  buildFlutterBundle,
  buildFlutterIos,
  buildFlutterIpa,
};

/**
 * Builds Flutter APK with release configuration, obfuscation, and split debug info
 * @param noFvm - Whether to disable FVM usage
 */
async function buildFlutterApk(noFvm: boolean) {
  await executeBuild(
    {
      type: "APK",
      command: "flutter build apk",
      flags: [
        ...BUILD_CONFIGS.APK.flags,
        `--split-debug-info=${BUILD_CONFIGS.APK.outputPath}`,
      ],
      requireAndroid: true,
    },
    noFvm
  );
}

/**
 * Builds Flutter App Bundle with release configuration, obfuscation, and split debug info
 * @param noFvm - Whether to disable FVM usage
 */
async function buildFlutterBundle(noFvm: boolean) {
  await executeBuild(
    {
      type: "Bundle",
      command: "flutter build appbundle",
      flags: [
        ...BUILD_CONFIGS.BUNDLE.flags,
        `--split-debug-info=${BUILD_CONFIGS.BUNDLE.outputPath}`,
      ],
      requireAndroid: true,
    },
    noFvm
  );
}

/**
 * Builds Flutter iOS app with release configuration
 * @param noFvm - Whether to disable FVM usage
 */
async function buildFlutterIos(noFvm: boolean) {
  await executeBuild(
    {
      type: "iOS app",
      command: "flutter build ios",
      flags: [...BUILD_CONFIGS.IOS.flags],
      requireIos: true,
    },
    noFvm
  );
}

/**
 * Creates release IPA with updated build version number
 * @param noFvm - Whether to disable FVM usage
 */
async function buildFlutterIpa(noFvm: boolean) {
  await executeBuild(
    {
      type: "IPA",
      command: "flutter build ipa",
      flags: [...BUILD_CONFIGS.IPA.flags],
      requireIos: true,
    },
    noFvm
  );
}
