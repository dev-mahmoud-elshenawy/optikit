import * as fs from "fs";
import * as path from "path";
import { LoggerHelpers } from "../utils/loggerHelpers.js";
import { execInIos, execCommand, iosDirectory, execInIosWithRetry } from "../utils/execHelpers.js";

export { cleanIosProject };

async function getFlutterSdkPath(): Promise<string> {
  const fvmDir = path.join(process.cwd(), ".fvm", "flutter_sdk");

  if (fs.existsSync(fvmDir)) {
    LoggerHelpers.info(`Using FVM Flutter SDK...`);
    return fvmDir;
  }

  const command = "which flutter";
  try {
    const globalFlutterPath = await execCommand(command);
    LoggerHelpers.info("Using Flutter SDK...");
    return path.dirname(globalFlutterPath.trim());
  } catch (error) {
    LoggerHelpers.error(
      "Flutter SDK not found. Please ensure Flutter is installed."
    );
    throw error; 
  }
}

async function getFlutterXcframeworkPath(): Promise<string> {
  const flutterSdkPath = await getFlutterSdkPath();
  return path.join(
    flutterSdkPath,
    "bin/cache/artifacts/engine/ios/Flutter.xcframework"
  );
}

async function ensureFlutterArtifactsExist() {
  const flutterXcframeworkPath = await getFlutterXcframeworkPath();

  if (!fs.existsSync(flutterXcframeworkPath)) {
    LoggerHelpers.warning("Flutter.xcframework not found.");

    try {
      LoggerHelpers.info("Downloading Flutter.xcframework...");
      await execCommand("fvm flutter precache --ios");
      LoggerHelpers.success(
        "Flutter.xcframework has been downloaded successfully."
      );
    } catch (error) {
      LoggerHelpers.error(
        `Failed to run precache: ${
          error instanceof Error ? error.message : error
        }`
      );
    }
  } else {
    LoggerHelpers.success(
      "Flutter.xcframework exists. No need to run 'fvm flutter precache --ios'."
    );
  }
}

async function cleanIosProject(cleanCache: boolean, repoUpdate: boolean) {
  try {
    const xcodeProjPath = path.join(iosDirectory, "Runner.xcodeproj");

    if (!fs.existsSync(xcodeProjPath)) {
      LoggerHelpers.error("No Xcode project found in the ios directory.");
      return;
    }

    LoggerHelpers.info("Running clean for iOS project...");

    await ensureFlutterArtifactsExist();

    LoggerHelpers.info("Removing Podfile.lock...");
    await execInIos("rm -rf Podfile.lock");
    LoggerHelpers.success("Removed Podfile.lock.");

    LoggerHelpers.info("Deintegrating pods...");
    await execInIos("pod deintegrate");
    LoggerHelpers.success("Deintegrated pods.");

    if (cleanCache) {
      LoggerHelpers.info("Cleaning CocoaPods cache...");
      await execInIos("pod cache clean --all");
      LoggerHelpers.success("Cleaned CocoaPods cache.");
    }

    if (repoUpdate) {
      LoggerHelpers.info("Updating CocoaPods repositories...");
      try {
        await execInIosWithRetry("pod repo update", 3, 10000); 
        LoggerHelpers.success("Updated CocoaPods repositories.");
      } catch (error) {
        LoggerHelpers.error("Failed to update CocoaPods repositories. Retrying...");
      }

      LoggerHelpers.info("Installing pods with repo update...");
      try {
        await execInIosWithRetry("pod update", 3, 10000); 
        LoggerHelpers.success("Installed pods with repo update.");
      } catch (error) {
        LoggerHelpers.error("Failed to update pods. Retrying...");
      }
    } else {
      LoggerHelpers.info("Installing pods without repo update...");
      await execInIosWithRetry("pod install", 3, 10000);
      LoggerHelpers.success("Installed pods without repo update.");
    }
  } catch (error) {
    if (error instanceof Error) {
      LoggerHelpers.error(`Error: ${error.message}`);
    } else if (typeof error === "string") {
      LoggerHelpers.error(`Error: ${error}`);
    } else {
      LoggerHelpers.error(`Unknown error: ${JSON.stringify(error)}`);
    }
  }
}
