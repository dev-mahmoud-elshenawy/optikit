import { validateFlutterProject } from "../../utils/validators/validation.js";
import { LoggerHelpers } from "../../utils/services/logger.js";
import {
  getCurrentVersion,
  incrementVersion,
  formatVersion,
  getNextBuildNumber
} from "../../utils/helpers/version.js";
import { updateFlutterVersion } from "./update.js";
import chalk from "chalk";

export {
  bumpVersion,
  bumpIosBuildOnly,
  bumpAndroidBuildOnly,
  showCurrentVersion
};

/**
 * Bumps version with semantic versioning (major, minor, patch)
 * Android build number increments with version
 * iOS build number resets to 1 on version change
 *
 * @param type - Type of version bump (major, minor, patch)
 */
async function bumpVersion(
  type: 'major' | 'minor' | 'patch'
): Promise<void> {
  // Pre-flight validation
  if (!validateFlutterProject()) {
    process.exit(1);
  }

  try {
    const current = getCurrentVersion();
    const newVersion = incrementVersion(current, type);

    LoggerHelpers.info(`Current version: ${formatVersion(current)}`);
    LoggerHelpers.info(`Bumping ${type} version...`);

    console.log(chalk.cyan("\nVersion changes:"));
    console.log(chalk.gray("  Old:"), chalk.white(formatVersion(current)));
    console.log(chalk.gray("  New:"), chalk.green.bold(formatVersion(newVersion)));

    console.log(chalk.cyan("\nBuild number strategy:"));
    console.log(chalk.gray("  Android:"), chalk.white(`${current.buildNumber} → ${newVersion.buildNumber} (incremented)`));
    console.log(chalk.gray("  iOS:"), chalk.white(`${current.buildNumber} → 1 (reset for new version)`));
    console.log();

    // Update with new version
    // Android uses the incremented build number from version
    // iOS gets reset to 1 for new version releases
    await updateFlutterVersion(
      `${newVersion.major}.${newVersion.minor}.${newVersion.patch}`,
      newVersion.buildNumber.toString(),
      "1"  // iOS always starts at 1 for new versions
    );

    LoggerHelpers.success(`Version bumped to ${formatVersion(newVersion)}`);
    console.log(chalk.gray("\nAndroid build:"), chalk.white(newVersion.buildNumber));
    console.log(chalk.gray("iOS build:"), chalk.white("1"));

  } catch (error) {
    if (error instanceof Error) {
      LoggerHelpers.error(`Error bumping version: ${error.message}`);
    } else {
      LoggerHelpers.error(`Error bumping version: ${error}`);
    }
    process.exit(1);
  }
}

/**
 * Increments ONLY iOS build number (for TestFlight builds)
 * Keeps version and Android build number unchanged
 * Perfect for uploading new iOS builds without changing app version
 *
 * Example: 1.0.2+45 (iOS: 45) → 1.0.2+45 (iOS: 46)
 */
async function bumpIosBuildOnly(): Promise<void> {
  // Pre-flight validation
  if (!validateFlutterProject()) {
    process.exit(1);
  }

  try {
    const current = getCurrentVersion();
    const currentVersionString = `${current.major}.${current.minor}.${current.patch}`;

    // iOS build number increments from current Android build number
    const nextIosBuild = current.buildNumber + 1;

    LoggerHelpers.info(`Current version: ${formatVersion(current)}`);
    LoggerHelpers.info("Incrementing iOS build number only (for TestFlight)...");

    console.log(chalk.cyan("\nBuild number changes:"));
    console.log(chalk.gray("  Version:"), chalk.white(`${currentVersionString} (unchanged)`));
    console.log(chalk.gray("  Android:"), chalk.white(`${current.buildNumber} (unchanged)`));
    console.log(chalk.gray("  iOS:"), chalk.white(`${current.buildNumber} → ${nextIosBuild}`), chalk.green("(incremented)"));
    console.log();

    // Update only iOS build number
    await updateFlutterVersion(
      currentVersionString,
      "",  // Empty string means don't update Android
      nextIosBuild.toString()
    );

    LoggerHelpers.success(`iOS build number incremented to ${nextIosBuild}`);
    console.log(chalk.gray("\nResult:"), chalk.white(`${currentVersionString}+${current.buildNumber} (iOS: ${nextIosBuild})`));
    console.log(chalk.gray("Use this for:"), chalk.white("TestFlight uploads without version changes"));

  } catch (error) {
    if (error instanceof Error) {
      LoggerHelpers.error(`Error incrementing iOS build: ${error.message}`);
    } else {
      LoggerHelpers.error(`Error incrementing iOS build: ${error}`);
    }
    process.exit(1);
  }
}

/**
 * Increments ONLY Android build number
 * Keeps version and iOS build number unchanged
 */
async function bumpAndroidBuildOnly(): Promise<void> {
  // Pre-flight validation
  if (!validateFlutterProject()) {
    process.exit(1);
  }

  try {
    const current = getCurrentVersion();
    const currentVersionString = `${current.major}.${current.minor}.${current.patch}`;
    const nextAndroidBuild = current.buildNumber + 1;

    LoggerHelpers.info(`Current version: ${formatVersion(current)}`);
    LoggerHelpers.info("Incrementing Android build number only...");

    console.log(chalk.cyan("\nBuild number changes:"));
    console.log(chalk.gray("  Version:"), chalk.white(`${currentVersionString} (unchanged)`));
    console.log(chalk.gray("  Android:"), chalk.white(`${current.buildNumber} → ${nextAndroidBuild}`), chalk.green("(incremented)"));
    console.log(chalk.gray("  iOS:"), chalk.white("(unchanged)"));
    console.log();

    // Update only Android build number
    await updateFlutterVersion(
      currentVersionString,
      nextAndroidBuild.toString(),
      ""  // Empty string means don't update iOS
    );

    LoggerHelpers.success(`Android build number incremented to ${nextAndroidBuild}`);

  } catch (error) {
    if (error instanceof Error) {
      LoggerHelpers.error(`Error incrementing Android build: ${error.message}`);
    } else {
      LoggerHelpers.error(`Error incrementing Android build: ${error}`);
    }
    process.exit(1);
  }
}

/**
 * Shows current version information
 */
async function showCurrentVersion(): Promise<void> {
  try {
    const current = getCurrentVersion();
    const versionString = formatVersion(current);

    console.log(chalk.bold("\n📱 Current Version Information\n"));
    console.log(chalk.cyan("Version:"), chalk.white.bold(versionString));
    console.log(chalk.gray("  Major:"), chalk.white(current.major));
    console.log(chalk.gray("  Minor:"), chalk.white(current.minor));
    console.log(chalk.gray("  Patch:"), chalk.white(current.patch));
    console.log(chalk.gray("  Build:"), chalk.white(current.buildNumber));
    console.log();

  } catch (error) {
    if (error instanceof Error) {
      LoggerHelpers.error(`Error reading version: ${error.message}`);
    } else {
      LoggerHelpers.error(`Error reading version: ${error}`);
    }
    process.exit(1);
  }
}

/**
 * Helper to get next iOS build number
 * In the future, this could read from Info.plist or project.pbxproj
 * For now, we'll use a simple increment
 */
async function getNextIosBuildNumber(): Promise<number> {
  // TODO: Read actual iOS build number from Info.plist or project.pbxproj
  // For now, we'll just increment based on timestamp or simple counter
  const current = getCurrentVersion();
  return current.buildNumber + 1;
}
