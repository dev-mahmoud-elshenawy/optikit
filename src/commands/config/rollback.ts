import fs from "fs";
import path from "path";
import { LoggerHelpers } from "../../utils/services/logger.js";
import { restoreBackup } from "../../utils/services/backup.js";
import chalk from "chalk";

export { rollbackFiles };

/**
 * Lists all available backups and allows restoration
 */
async function rollbackFiles(): Promise<void> {
  try {
    LoggerHelpers.info("Searching for OptiKit backups...");

    const backups = findAllBackups(process.cwd());

    if (backups.length === 0) {
      LoggerHelpers.warning("No backups found in this project.");
      LoggerHelpers.info("Backups are created automatically when files are modified.");
      return;
    }

    console.log(chalk.bold(`\nFound ${backups.length} backup(s):\n`));

    // Group backups by original file
    const backupsByFile = new Map<string, Array<{
      backupPath: string;
      timestamp: Date;
      size: number;
    }>>();

    for (const backup of backups) {
      const originalFile = getOriginalFilePath(backup.backupPath);
      if (!backupsByFile.has(originalFile)) {
        backupsByFile.set(originalFile, []);
      }
      backupsByFile.get(originalFile)!.push(backup);
    }

    // Display backups grouped by file
    let index = 1;
    const backupList: Array<{
      index: number;
      originalPath: string;
      backupPath: string;
      timestamp: Date;
    }> = [];

    for (const [originalFile, fileBackups] of backupsByFile) {
      console.log(chalk.cyan.bold(`\n${originalFile}`));

      // Sort by timestamp (newest first)
      fileBackups.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

      for (const backup of fileBackups) {
        const timeAgo = getTimeAgo(backup.timestamp);
        const sizeKB = (backup.size / 1024).toFixed(2);

        console.log(
          chalk.gray(`  [${index}]`),
          chalk.white(backup.timestamp.toLocaleString()),
          chalk.gray(`(${timeAgo}, ${sizeKB} KB)`)
        );

        backupList.push({
          index,
          originalPath: originalFile,
          backupPath: backup.backupPath,
          timestamp: backup.timestamp,
        });

        index++;
      }
    }

    console.log(chalk.yellow("\n" + "=".repeat(60)));
    console.log(chalk.gray("To restore a backup, run:"));
    console.log(chalk.white("  optikit rollback --restore <number>"));
    console.log(chalk.gray("\nExample:"));
    console.log(chalk.white("  optikit rollback --restore 1"));
    console.log(chalk.yellow("=".repeat(60) + "\n"));

  } catch (error) {
    if (error instanceof Error) {
      LoggerHelpers.error(`Error listing backups: ${error.message}`);
    } else {
      LoggerHelpers.error(`Error listing backups: ${error}`);
    }
    process.exit(1);
  }
}

/**
 * Restores a specific backup by index
 */
export async function rollbackRestore(index: number): Promise<void> {
  try {
    const backups = findAllBackups(process.cwd());

    if (index < 1 || index > backups.length) {
      LoggerHelpers.error(`Invalid backup index: ${index}`);
      LoggerHelpers.info(`Please choose a number between 1 and ${backups.length}`);
      process.exit(1);
    }

    const backup = backups[index - 1];
    const originalPath = getOriginalFilePath(backup.backupPath);

    LoggerHelpers.info(`Restoring: ${originalPath}`);
    LoggerHelpers.info(`From backup: ${backup.timestamp.toLocaleString()}`);

    const success = restoreBackup(originalPath, backup.backupPath);

    if (success) {
      LoggerHelpers.success("Backup restored successfully!");
    } else {
      LoggerHelpers.error("Failed to restore backup.");
      process.exit(1);
    }
  } catch (error) {
    if (error instanceof Error) {
      LoggerHelpers.error(`Error restoring backup: ${error.message}`);
    } else {
      LoggerHelpers.error(`Error restoring backup: ${error}`);
    }
    process.exit(1);
  }
}

/**
 * Recursively finds all backup files in a directory
 */
function findAllBackups(
  dir: string
): Array<{ backupPath: string; timestamp: Date; size: number }> {
  const backups: Array<{ backupPath: string; timestamp: Date; size: number }> = [];

  function searchDirectory(currentDir: string): void {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);

      if (entry.isDirectory()) {
        if (entry.name === ".optikit-backup") {
          // Found a backup directory
          const backupFiles = fs.readdirSync(fullPath);
          for (const backupFile of backupFiles) {
            const backupPath = path.join(fullPath, backupFile);
            const stats = fs.statSync(backupPath);
            backups.push({
              backupPath,
              timestamp: stats.mtime,
              size: stats.size,
            });
          }
        } else if (!entry.name.startsWith(".") && entry.name !== "node_modules") {
          // Recursively search subdirectories
          searchDirectory(fullPath);
        }
      }
    }
  }

  searchDirectory(dir);
  return backups;
}

/**
 * Extracts the original file path from a backup path
 */
function getOriginalFilePath(backupPath: string): string {
  const backupDir = path.dirname(backupPath);
  const originalDir = path.dirname(backupDir);
  const backupFileName = path.basename(backupPath);

  // Remove timestamp from filename
  // Format: filename_YYYY-MM-DDTHH-MM-SS-mmmZ.ext
  const match = backupFileName.match(/^(.+)_\d{4}-\d{2}-\d{2}T[\d-]+Z(\.\w+)$/);

  if (match) {
    const [, baseName, extension] = match;
    return path.join(originalDir, `${baseName}${extension}`);
  }

  return path.join(originalDir, backupFileName);
}

/**
 * Gets human-readable time ago string
 */
function getTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}
