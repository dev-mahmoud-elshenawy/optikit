import fs from "fs";
import path from "path";
import { LoggerHelpers } from "../../utils/services/logger.js";
import { saveConfig } from "../../utils/services/config.js";

export { initializeProject };

/**
 * Initializes OptiKit in the current project
 * Creates .optikitrc configuration file with defaults
 */
async function initializeProject(): Promise<void> {
  try {
    LoggerHelpers.info("Initializing OptiKit in this project...");

    const configPath = path.join(process.cwd(), ".optikitrc.json");

    // Check if config already exists
    if (fs.existsSync(configPath)) {
      LoggerHelpers.warning("OptiKit configuration already exists.");
      LoggerHelpers.info("To reconfigure, delete .optikitrc.json and run init again.");
      return;
    }

    // Create default configuration
    const defaultConfig = {
      backupRetentionCount: 5,
      useFvmByDefault: true,
      autoBackup: true,
      verbose: false,
    };

    // Save configuration
    const success = saveConfig(defaultConfig);

    if (success) {
      LoggerHelpers.success("OptiKit initialized successfully!");
      console.log("\nDefault configuration:");
      console.log(JSON.stringify(defaultConfig, null, 2));
      console.log("\nYou can modify .optikitrc.json to customize these settings.\n");

      // Create .gitignore entry for backups if .gitignore exists
      const gitignorePath = path.join(process.cwd(), ".gitignore");
      if (fs.existsSync(gitignorePath)) {
        const gitignoreContent = fs.readFileSync(gitignorePath, "utf8");
        if (!gitignoreContent.includes(".optikit-backup")) {
          fs.appendFileSync(
            gitignorePath,
            "\n# OptiKit backup files\n.optikit-backup/\n"
          );
          LoggerHelpers.success("Added .optikit-backup/ to .gitignore");
        }
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      LoggerHelpers.error(`Error initializing project: ${error.message}`);
    } else {
      LoggerHelpers.error(`Error initializing project: ${error}`);
    }
    process.exit(1);
  }
}
