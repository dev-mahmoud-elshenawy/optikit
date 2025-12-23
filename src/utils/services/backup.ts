import fs from "fs";
import path from "path";
import { LoggerHelpers } from "./logger.js";

export { createBackup, restoreBackup, cleanupBackups, getBackupPath };

/**
 * Creates a backup of a file with timestamp
 * Returns the backup path if successful, null otherwise
 */
function createBackup(filePath: string): string | null {
  try {
    if (!fs.existsSync(filePath)) {
      LoggerHelpers.warning(`File does not exist, skipping backup: ${filePath}`);
      return null;
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const parsedPath = path.parse(filePath);
    const backupPath = path.join(
      parsedPath.dir,
      `.optikit-backup`,
      `${parsedPath.name}_${timestamp}${parsedPath.ext}`
    );

    // Create backup directory if it doesn't exist
    const backupDir = path.dirname(backupPath);
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    // Copy file to backup location
    fs.copyFileSync(filePath, backupPath);
    LoggerHelpers.info(`Backup created: ${backupPath}`);

    return backupPath;
  } catch (error) {
    LoggerHelpers.error(
      `Failed to create backup: ${error instanceof Error ? error.message : error}`
    );
    return null;
  }
}

/**
 * Restores a file from backup
 */
function restoreBackup(originalPath: string, backupPath: string): boolean {
  try {
    if (!fs.existsSync(backupPath)) {
      LoggerHelpers.error(`Backup file not found: ${backupPath}`);
      return false;
    }

    fs.copyFileSync(backupPath, originalPath);
    LoggerHelpers.success(`Restored from backup: ${originalPath}`);
    return true;
  } catch (error) {
    LoggerHelpers.error(
      `Failed to restore backup: ${error instanceof Error ? error.message : error}`
    );
    return false;
  }
}

/**
 * Cleans up old backups (keeps only the most recent N backups)
 */
function cleanupBackups(directory: string, keepCount: number = 5): void {
  try {
    const backupDir = path.join(directory, ".optikit-backup");

    if (!fs.existsSync(backupDir)) {
      return;
    }

    const files = fs.readdirSync(backupDir);

    // Sort by modification time (newest first)
    const sortedFiles = files
      .map((file) => ({
        name: file,
        path: path.join(backupDir, file),
        mtime: fs.statSync(path.join(backupDir, file)).mtime.getTime(),
      }))
      .sort((a, b) => b.mtime - a.mtime);

    // Delete old backups beyond keepCount
    if (sortedFiles.length > keepCount) {
      const filesToDelete = sortedFiles.slice(keepCount);
      filesToDelete.forEach((file) => {
        fs.unlinkSync(file.path);
        LoggerHelpers.info(`Cleaned up old backup: ${file.name}`);
      });
    }
  } catch (error) {
    LoggerHelpers.warning(
      `Failed to cleanup backups: ${error instanceof Error ? error.message : error}`
    );
  }
}

/**
 * Gets the backup directory path for a given file
 */
function getBackupPath(filePath: string): string {
  const parsedPath = path.parse(filePath);
  return path.join(parsedPath.dir, ".optikit-backup");
}
