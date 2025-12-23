import { LoggerHelpers } from "../services/logger.js";
import chalk from "chalk";

export { DryRunManager, isDryRunMode, setDryRunMode };

/**
 * Global dry-run state
 */
let dryRunEnabled = false;

/**
 * Check if dry-run mode is enabled
 */
function isDryRunMode(): boolean {
  return dryRunEnabled;
}

/**
 * Set dry-run mode
 */
function setDryRunMode(enabled: boolean): void {
  dryRunEnabled = enabled;
  if (enabled) {
    LoggerHelpers.info(chalk.yellow("🔍 DRY-RUN MODE ENABLED - No commands will be executed"));
    console.log(chalk.gray("Commands will be displayed but not run\n"));
  }
}

/**
 * Dry-run manager for tracking and displaying operations
 */
class DryRunManager {
  private operations: Array<{
    type: string;
    description: string;
    command?: string;
    details?: string;
  }> = [];

  /**
   * Log a command that would be executed
   */
  logCommand(description: string, command: string, details?: string): void {
    if (!isDryRunMode()) return;

    this.operations.push({
      type: "command",
      description,
      command,
      details,
    });

    console.log(chalk.cyan("→"), chalk.bold(description));
    console.log(chalk.gray("  Command:"), chalk.white(command));
    if (details) {
      console.log(chalk.gray("  Details:"), details);
    }
    console.log();
  }

  /**
   * Log a file operation that would be performed
   */
  logFileOperation(operation: string, filePath: string, details?: string): void {
    if (!isDryRunMode()) return;

    this.operations.push({
      type: "file",
      description: `${operation}: ${filePath}`,
      details,
    });

    console.log(chalk.cyan("→"), chalk.bold(operation));
    console.log(chalk.gray("  File:"), chalk.white(filePath));
    if (details) {
      console.log(chalk.gray("  Details:"), details);
    }
    console.log();
  }

  /**
   * Log a validation check
   */
  logValidation(check: string, result: boolean, message?: string): void {
    if (!isDryRunMode()) return;

    const icon = result ? chalk.green("✓") : chalk.red("✗");
    const status = result ? chalk.green("PASS") : chalk.red("FAIL");

    console.log(icon, chalk.bold(check), status);
    if (message) {
      console.log(chalk.gray("  "), message);
    }
  }

  /**
   * Display summary of dry-run operations
   */
  displaySummary(): void {
    if (!isDryRunMode() || this.operations.length === 0) return;

    console.log(chalk.yellow("\n" + "=".repeat(60)));
    console.log(chalk.yellow.bold("DRY-RUN SUMMARY"));
    console.log(chalk.yellow("=".repeat(60)));

    const commands = this.operations.filter((op) => op.type === "command");
    const files = this.operations.filter((op) => op.type === "file");

    console.log(chalk.white(`\nTotal operations: ${this.operations.length}`));
    console.log(chalk.white(`  Commands: ${commands.length}`));
    console.log(chalk.white(`  File operations: ${files.length}`));

    console.log(chalk.yellow("\n" + "=".repeat(60)));
    console.log(chalk.gray("No actual changes were made to your system."));
    console.log(chalk.gray("Run without --dry-run to execute these operations.\n"));
  }

  /**
   * Reset the operations log
   */
  reset(): void {
    this.operations = [];
  }
}
