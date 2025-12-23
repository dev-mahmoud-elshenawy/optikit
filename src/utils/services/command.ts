import { validateFlutterProject, validateFlutterSdk, validateIosProject, validateAndroidProject } from "../validators/validation.js";

export { validateBuildEnvironment, getFlutterCommand };

/**
 * Validation options for build environment
 */
interface ValidationOptions {
  requireFlutterProject?: boolean;
  requireFlutterSdk?: boolean;
  requireIosProject?: boolean;
  requireAndroidProject?: boolean;
  useFvm?: boolean;
}

/**
 * Performs common validation checks for commands
 * Exits with code 1 if any validation fails
 *
 * @param options - Validation options
 * @returns true if all validations pass (won't return false, exits instead)
 */
function validateBuildEnvironment(options: ValidationOptions): boolean {
  const {
    requireFlutterProject = true,
    requireFlutterSdk = false,
    requireIosProject = false,
    requireAndroidProject = false,
    useFvm = false,
  } = options;

  // Flutter project validation
  if (requireFlutterProject && !validateFlutterProject()) {
    process.exit(1);
  }

  // Flutter SDK validation (async)
  if (requireFlutterSdk) {
    validateFlutterSdk(useFvm).then((isValid) => {
      if (!isValid) {
        process.exit(1);
      }
    });
  }

  // iOS project validation
  if (requireIosProject && !validateIosProject()) {
    process.exit(1);
  }

  // Android project validation
  if (requireAndroidProject && !validateAndroidProject()) {
    process.exit(1);
  }

  return true;
}

/**
 * Gets the appropriate Flutter command based on FVM usage
 *
 * @param baseCommand - The base Flutter command (e.g., "flutter clean")
 * @param useFvm - Whether to use FVM
 * @returns The command string with or without FVM prefix
 *
 * @example
 * getFlutterCommand("flutter clean", true) // "fvm flutter clean"
 * getFlutterCommand("flutter pub get", false) // "flutter pub get"
 */
function getFlutterCommand(baseCommand: string, useFvm: boolean): string {
  if (useFvm) {
    // Replace "flutter" with "fvm flutter"
    return baseCommand.replace(/^flutter\s/, "fvm flutter ");
  }
  return baseCommand;
}
