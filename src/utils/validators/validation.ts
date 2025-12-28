import fs from "fs";
import path from "path";
import { execCommandSilent } from "../services/exec.js";
import { LoggerHelpers } from "../services/logger.js";

export {
  validateFlutterProject,
  validateFlutterSdk,
  validateIosProject,
  validateAndroidProject,
  checkFileExists,
};

/**
 * Validates that the current directory is a Flutter project
 * by checking for pubspec.yaml
 */
function validateFlutterProject(): boolean {
  const pubspecPath = path.join(process.cwd(), "pubspec.yaml");

  if (!fs.existsSync(pubspecPath)) {
    LoggerHelpers.error("Not a Flutter project: pubspec.yaml not found.");
    LoggerHelpers.info("Please run this command from the root of a Flutter project.");
    return false;
  }

  // Check if pubspec.yaml contains Flutter SDK
  const pubspecContent = fs.readFileSync(pubspecPath, "utf8");
  if (!pubspecContent.includes("flutter:")) {
    LoggerHelpers.error("Not a Flutter project: pubspec.yaml does not reference Flutter SDK.");
    return false;
  }

  return true;
}

/**
 * Validates that Flutter SDK is available (either via FVM or globally)
 */
async function validateFlutterSdk(useFvm: boolean = false): Promise<boolean> {
  try {
    if (useFvm) {
      // Check if FVM directory exists
      const fvmPath = path.join(process.cwd(), ".fvm", "flutter_sdk");
      if (!fs.existsSync(fvmPath)) {
        LoggerHelpers.error("FVM Flutter SDK not found at .fvm/flutter_sdk");
        LoggerHelpers.info("Run 'fvm install' or use --disable-fvm flag.");
        return false;
      }

      // Check if fvm command is available
      await execCommandSilent("fvm --version");
      return true;
    } else {
      // Check if global Flutter is available
      await execCommandSilent("flutter --version");
      return true;
    }
  } catch (error) {
    if (useFvm) {
      LoggerHelpers.error("FVM not found. Please install FVM or use --disable-fvm flag.");
      LoggerHelpers.info("Install FVM: https://fvm.app/docs/getting_started/installation");
    } else {
      LoggerHelpers.error("Flutter SDK not found.");
      LoggerHelpers.info("Install Flutter: https://flutter.dev/docs/get-started/install");
    }
    return false;
  }
}

/**
 * Validates that the iOS project exists
 */
function validateIosProject(): boolean {
  const iosPath = path.join(process.cwd(), "ios");

  if (!fs.existsSync(iosPath)) {
    LoggerHelpers.error("iOS project directory not found.");
    LoggerHelpers.info("Run 'flutter create .' to add iOS support.");
    return false;
  }

  const xcodeProjPath = path.join(iosPath, "Runner.xcodeproj");
  const xcworkspacePath = path.join(iosPath, "Runner.xcworkspace");

  if (!fs.existsSync(xcodeProjPath) && !fs.existsSync(xcworkspacePath)) {
    LoggerHelpers.error("No Xcode project or workspace found in ios/ directory.");
    return false;
  }

  return true;
}

/**
 * Validates that the Android project exists
 */
function validateAndroidProject(): boolean {
  const androidPath = path.join(process.cwd(), "android");

  if (!fs.existsSync(androidPath)) {
    LoggerHelpers.error("Android project directory not found.");
    LoggerHelpers.info("Run 'flutter create .' to add Android support.");
    return false;
  }

  const buildGradlePath = path.join(androidPath, "build.gradle");
  const buildGradleKtsPath = path.join(androidPath, "build.gradle.kts");

  if (!fs.existsSync(buildGradlePath) && !fs.existsSync(buildGradleKtsPath)) {
    LoggerHelpers.error("No build.gradle found in android/ directory.");
    return false;
  }

  return true;
}

/**
 * Checks if a file exists at the given path
 */
function checkFileExists(filePath: string): boolean {
  return fs.existsSync(filePath);
}
