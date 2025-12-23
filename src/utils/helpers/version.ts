import fs from "fs";
import path from "path";
import { LoggerHelpers } from "../services/logger.js";

export { parseVersion, incrementVersion, getCurrentVersion, VersionInfo };

/**
 * Version information structure
 */
interface VersionInfo {
  major: number;
  minor: number;
  patch: number;
  buildNumber: number;
}

/**
 * Parses a version string in format "X.Y.Z+B"
 * @param versionString - Version string (e.g., "1.2.3+45")
 * @returns Parsed version info
 */
function parseVersion(versionString: string): VersionInfo {
  const match = versionString.match(/^(\d+)\.(\d+)\.(\d+)\+(\d+)$/);

  if (!match) {
    throw new Error(`Invalid version format: ${versionString}. Expected format: X.Y.Z+B (e.g., 1.2.3+45)`);
  }

  return {
    major: parseInt(match[1], 10),
    minor: parseInt(match[2], 10),
    patch: parseInt(match[3], 10),
    buildNumber: parseInt(match[4], 10),
  };
}

/**
 * Increments version based on type
 * @param current - Current version info
 * @param type - Type of increment (major, minor, patch)
 * @param resetIosBuildNumber - Whether to reset iOS build number to 1
 * @returns New version info
 */
function incrementVersion(
  current: VersionInfo,
  type: 'major' | 'minor' | 'patch',
  resetIosBuildNumber: boolean = false
): VersionInfo {
  const newVersion = { ...current };

  switch (type) {
    case 'major':
      newVersion.major += 1;
      newVersion.minor = 0;
      newVersion.patch = 0;
      newVersion.buildNumber += 1;
      break;
    case 'minor':
      newVersion.minor += 1;
      newVersion.patch = 0;
      newVersion.buildNumber += 1;
      break;
    case 'patch':
      newVersion.patch += 1;
      newVersion.buildNumber += 1;
      break;
  }

  return newVersion;
}

/**
 * Gets current version from pubspec.yaml
 * @returns Current version info
 */
function getCurrentVersion(): VersionInfo {
  const pubspecPath = path.join(process.cwd(), "pubspec.yaml");

  if (!fs.existsSync(pubspecPath)) {
    throw new Error("pubspec.yaml not found. Are you in a Flutter project?");
  }

  const pubspecContent = fs.readFileSync(pubspecPath, "utf8");
  const versionMatch = pubspecContent.match(/version:\s*(\d+\.\d+\.\d+\+\d+)/);

  if (!versionMatch) {
    throw new Error("No version found in pubspec.yaml");
  }

  return parseVersion(versionMatch[1]);
}

/**
 * Formats version info to string
 * @param version - Version info
 * @returns Formatted version string (e.g., "1.2.3+45")
 */
export function formatVersion(version: VersionInfo): string {
  return `${version.major}.${version.minor}.${version.patch}+${version.buildNumber}`;
}

/**
 * Gets the next build number from current version
 * @returns Next build number
 */
export function getNextBuildNumber(): number {
  const current = getCurrentVersion();
  return current.buildNumber + 1;
}
