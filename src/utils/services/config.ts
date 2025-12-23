import fs from "fs";
import path from "path";
import { LoggerHelpers } from "./logger.js";

export { loadConfig, saveConfig, getConfigPath, OptiKitConfig };

/**
 * OptiKit configuration interface
 */
interface OptiKitConfig {
  /** Backup retention count */
  backupRetentionCount?: number;
  /** Default FVM usage */
  useFvmByDefault?: boolean;
  /** Auto-create backups before destructive operations */
  autoBackup?: boolean;
  /** Verbose logging */
  verbose?: boolean;
}

/**
 * Default configuration
 */
const DEFAULT_CONFIG: OptiKitConfig = {
  backupRetentionCount: 5,
  useFvmByDefault: false,
  autoBackup: true,
  verbose: false,
};

/**
 * Gets the config file path
 * Checks multiple locations in priority order:
 * 1. .optikitrc in current directory
 * 2. .optikitrc in home directory
 *
 * @returns Config file path or null if not found
 */
function getConfigPath(): string | null {
  const cwd = process.cwd();
  const home = process.env.HOME || process.env.USERPROFILE || "";

  const possiblePaths = [
    path.join(cwd, ".optikitrc"),
    path.join(cwd, ".optikitrc.json"),
    path.join(home, ".optikitrc"),
    path.join(home, ".optikitrc.json"),
  ];

  for (const configPath of possiblePaths) {
    if (fs.existsSync(configPath)) {
      return configPath;
    }
  }

  return null;
}

/**
 * Loads configuration from .optikitrc file
 * Falls back to default configuration if file doesn't exist
 *
 * @returns Merged configuration (defaults + user config)
 */
function loadConfig(): OptiKitConfig {
  const configPath = getConfigPath();

  if (!configPath) {
    return { ...DEFAULT_CONFIG };
  }

  try {
    const fileContent = fs.readFileSync(configPath, "utf8");
    const userConfig = JSON.parse(fileContent) as Partial<OptiKitConfig>;

    // Merge with defaults
    return {
      ...DEFAULT_CONFIG,
      ...userConfig,
    };
  } catch (error) {
    LoggerHelpers.warning(`Failed to load config from ${configPath}, using defaults.`);
    return { ...DEFAULT_CONFIG };
  }
}

/**
 * Saves configuration to .optikitrc file in current directory
 *
 * @param config - Configuration to save
 * @returns true if successful, false otherwise
 */
function saveConfig(config: OptiKitConfig): boolean {
  const configPath = path.join(process.cwd(), ".optikitrc.json");

  try {
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2), "utf8");
    LoggerHelpers.success(`Configuration saved to ${configPath}`);
    return true;
  } catch (error) {
    LoggerHelpers.error(
      `Failed to save config: ${error instanceof Error ? error.message : error}`
    );
    return false;
  }
}
