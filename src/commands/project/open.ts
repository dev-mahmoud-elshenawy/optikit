import { LoggerHelpers } from "../../utils/services/logger.js";
import { execCommand } from "../../utils/services/exec.js";
import { platform } from "os";
import { validateFlutterProject, validateIosProject, validateAndroidProject } from "../../utils/validators/validation.js";

export { openIos, openAndroid };

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
