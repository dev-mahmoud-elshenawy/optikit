import { LoggerHelpers } from "../../utils/services/logger.js";
import { execCommand } from "../../utils/services/exec.js";
import { platform } from "os";
import { validateFlutterProject, validateIosProject, validateAndroidProject } from "../../utils/validators/validation.js";
import * as fs from "fs";
import * as path from "path";

export { openIos, openAndroid, openIpaOutput, openBundleOutput, openApkOutput };

async function openIos() {
  LoggerHelpers.info("Opening the iOS project in Xcode...");

  // Pre-flight validation
  if (!validateFlutterProject()) {
    process.exit(1);
  }

  if (!validateIosProject()) {
    process.exit(1);
  }

  const command = "open ios/Runner.xcworkspace";

  try {
    await execCommand(command);
    LoggerHelpers.success("Xcode opened successfully.");
  } catch (error) {
    if (error instanceof Error) {
      LoggerHelpers.error(`Error while opening Xcode: ${error.message}`);
    } else {
      LoggerHelpers.error(`Error while opening Xcode: ${error}`);
    }
    process.exit(1);
  }
}

async function openAndroid() {
    LoggerHelpers.info("Opening the Android project in Android Studio...");

    // Pre-flight validation
    if (!validateFlutterProject()) {
      process.exit(1);
    }

    if (!validateAndroidProject()) {
      process.exit(1);
    }

    const osPlatform = platform();
    let command;


    if (osPlatform === "win32") {
      command = "start android";
    } else if (osPlatform === "darwin") {
      command = "open -a 'Android Studio' android";
    } else {
      command = "xdg-open android";
    }

    try {
      await execCommand(command);
      LoggerHelpers.success("Android Studio opened successfully.");
    } catch (error) {
      if (error instanceof Error) {
        LoggerHelpers.error(
          `Error while opening Android Studio: ${error.message}`
        );
      } else {
        LoggerHelpers.error(`Error while opening Android Studio: ${error}`);
      }
      process.exit(1);
    }
}

/**
 * Opens the IPA build output directory in Finder (macOS) or File Explorer (Windows/Linux)
 */
async function openIpaOutput(): Promise<void> {
  if (!validateFlutterProject()) {
    process.exit(1);
  }

  const ipaPath = path.join(process.cwd(), "build", "ios", "ipa");

  if (!fs.existsSync(ipaPath)) {
    LoggerHelpers.warning(`IPA output directory not found: ${ipaPath}`);
    LoggerHelpers.info("Build an IPA first using: optikit flutter-build-ipa");
    process.exit(1);
  }

  try {
    const openCommand = getOpenCommand();
    await execCommand(`${openCommand} "${ipaPath}"`);
    LoggerHelpers.success(`Opened IPA output directory`);
  } catch (error) {
    if (error instanceof Error) {
      LoggerHelpers.error(`Error opening IPA directory: ${error.message}`);
    } else {
      LoggerHelpers.error(`Error opening IPA directory: ${error}`);
    }
    process.exit(1);
  }
}

/**
 * Opens the Android App Bundle output directory in Finder (macOS) or File Explorer (Windows/Linux)
 */
async function openBundleOutput(): Promise<void> {
  if (!validateFlutterProject()) {
    process.exit(1);
  }

  const bundlePath = path.join(
    process.cwd(),
    "build",
    "app",
    "outputs",
    "bundle",
    "release"
  );

  if (!fs.existsSync(bundlePath)) {
    LoggerHelpers.warning(`Bundle output directory not found: ${bundlePath}`);
    LoggerHelpers.info("Build a bundle first using: optikit flutter-build-bundle");
    process.exit(1);
  }

  try {
    const openCommand = getOpenCommand();
    await execCommand(`${openCommand} "${bundlePath}"`);
    LoggerHelpers.success(`Opened Bundle output directory`);
  } catch (error) {
    if (error instanceof Error) {
      LoggerHelpers.error(`Error opening Bundle directory: ${error.message}`);
    } else {
      LoggerHelpers.error(`Error opening Bundle directory: ${error}`);
    }
    process.exit(1);
  }
}

/**
 * Opens the APK build output directory in Finder (macOS) or File Explorer (Windows/Linux)
 */
async function openApkOutput(): Promise<void> {
  if (!validateFlutterProject()) {
    process.exit(1);
  }

  const apkPath = path.join(
    process.cwd(),
    "build",
    "app",
    "outputs",
    "flutter-apk"
  );

  if (!fs.existsSync(apkPath)) {
    LoggerHelpers.warning(`APK output directory not found: ${apkPath}`);
    LoggerHelpers.info("Build an APK first using: optikit flutter-build-apk");
    process.exit(1);
  }

  try {
    const openCommand = getOpenCommand();
    await execCommand(`${openCommand} "${apkPath}"`);
    LoggerHelpers.success(`Opened APK output directory`);
  } catch (error) {
    if (error instanceof Error) {
      LoggerHelpers.error(`Error opening APK directory: ${error.message}`);
    } else {
      LoggerHelpers.error(`Error opening APK directory: ${error}`);
    }
    process.exit(1);
  }
}

/**
 * Returns the appropriate command to open a directory based on the platform
 */
function getOpenCommand(): string {
  const osPlatform = platform();

  switch (osPlatform) {
    case "darwin": // macOS
      return "open";
    case "win32": // Windows
      return "start";
    default: // Linux and others
      return "xdg-open";
  }
}
