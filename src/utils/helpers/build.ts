import { execCommand } from "../services/exec.js";
import { LoggerHelpers } from "../services/logger.js";
import { validateFlutterProject, validateFlutterSdk, validateIosProject, validateAndroidProject } from "../validators/validation.js";

export { executeBuild, BuildConfig };

/**
 * Build configuration
 */
interface BuildConfig {
  /** Build type name (e.g., "APK", "Bundle", "iOS", "IPA") */
  type: string;
  /** Base Flutter command (e.g., "flutter build apk") */
  command: string;
  /** Additional build flags */
  flags?: string[];
  /** Whether to validate iOS project */
  requireIos?: boolean;
  /** Whether to validate Android project */
  requireAndroid?: boolean;
}

/**
 * Executes a Flutter build with common validation and error handling
 *
 * @param config - Build configuration
 * @param noFvm - Whether to disable FVM usage
 *
 * @example
 * await executeBuild({
 *   type: "APK",
 *   command: "flutter build apk",
 *   flags: ["--release", "--obfuscate", "--split-debug-info=build/app/outputs/symbols"],
 *   requireAndroid: true
 * }, false);
 */
async function executeBuild(config: BuildConfig, noFvm: boolean): Promise<void> {
  const { type, command, flags = [], requireIos = false, requireAndroid = false } = config;

  LoggerHelpers.info(
    noFvm
      ? `Building Flutter ${type} without FVM...`
      : `Building Flutter ${type} with FVM...`
  );

  // Pre-flight validation
  if (!validateFlutterProject()) {
    process.exit(1);
  }

  if (!(await validateFlutterSdk(!noFvm))) {
    process.exit(1);
  }

  if (requireIos && !validateIosProject()) {
    process.exit(1);
  }

  if (requireAndroid && !validateAndroidProject()) {
    process.exit(1);
  }

  // Build the full command
  const baseCommand = noFvm ? command : command.replace(/^flutter\s/, "fvm flutter ");
  const fullCommand = flags.length > 0
    ? `${baseCommand} ${flags.join(" ")}`
    : baseCommand;

  try {
    await execCommand(fullCommand);
    LoggerHelpers.success(`Flutter ${type} build successful.`);
  } catch (error) {
    if (error instanceof Error) {
      LoggerHelpers.error(`Error during ${type} build: ${error.message}`);
    } else {
      LoggerHelpers.error(`Error during ${type} build: ${error}`);
    }
    process.exit(1);
  }
}
