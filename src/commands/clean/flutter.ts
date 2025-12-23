import fs from "fs";
import path from "path";
import { execCommand } from "../../utils/services/exec.js";
import { LoggerHelpers } from "../../utils/services/logger.js";
import { validateFlutterProject, validateFlutterSdk } from "../../utils/validators/validation.js";
import { createBackup } from "../../utils/services/backup.js";

export { cleanProject };

async function cleanProject(noFvm: boolean) {
  LoggerHelpers.info(
    noFvm ? "Running clean without FVM..." : "Running clean with FVM..."
  );

  // Pre-flight validation
  if (!validateFlutterProject()) {
    process.exit(1);
  }

  if (!(await validateFlutterSdk(!noFvm))) {
    process.exit(1);
  }

  try {
    // Step 1: Run flutter clean
    const flutterCommand = noFvm ? "flutter clean" : "fvm flutter clean";
    LoggerHelpers.info("Running Flutter clean...");
    await execCommand(flutterCommand);
    LoggerHelpers.success("Flutter clean completed.");

    // Step 2: Remove pubspec.lock using Node.js fs (cross-platform)
    const pubspecLockPath = path.join(process.cwd(), "pubspec.lock");
    if (fs.existsSync(pubspecLockPath)) {
      LoggerHelpers.info("Removing pubspec.lock...");
      // Create backup before deletion
      createBackup(pubspecLockPath);
      fs.unlinkSync(pubspecLockPath);
      LoggerHelpers.success("pubspec.lock removed.");
    } else {
      LoggerHelpers.info("pubspec.lock does not exist, skipping removal.");
    }

    // Step 3: Run flutter pub get
    const pubGetCommand = noFvm ? "flutter pub get" : "fvm flutter pub get";
    LoggerHelpers.info("Running Flutter pub get...");
    await execCommand(pubGetCommand);
    LoggerHelpers.success("Flutter pub get completed.");

    LoggerHelpers.success("Project cleaned successfully.");
  } catch (error) {
    if (error instanceof Error) {
      LoggerHelpers.error(`Error during clean: ${error.message}`);
    } else {
      LoggerHelpers.error(`Error during clean: ${error}`);
    }
    process.exit(1);
  }
}
