import chalk from "chalk";
import { execCommand } from "../utils/execHelpers.js";
import { LoggerHelpers } from "../utils/loggerHelpers.js";

export {
  createVscodeSettings,
};

/**
 * Creates a .vscode directory (if it doesn't exist) and writes a settings.json file
 * with recommended Flutter configuration. The Flutter SDK path is set to ".fvm/flutter_sdk".
 */
async function createVscodeSettings(): Promise<void> {
  try {
    // Create the .vscode folder (using -p ensures it won't error if it already exists)
    await execCommand('mkdir -p .vscode');
    LoggerHelpers.success("Created .vscode directory (if not already present).");

    // Use a heredoc to write the settings.json file
    const command = `
cat << 'EOF' > .vscode/settings.json
{
  "dart.flutterSdkPath": ".fvm/flutter_sdk",
  "editor.formatOnSave": true,
  "dart.previewFlutterUiGuides": true,
  "files.exclude": {
    "**/.git": true,
    "**/.DS_Store": true,
    "**/node_modules": true,
    "**/build": true
  }
}
EOF
`;
    await execCommand(command);
    LoggerHelpers.success("Created .vscode/settings.json with Flutter configuration.");
  } catch (error) {
    if (error instanceof Error) {
      LoggerHelpers.error(`Error while creating VSCode settings: ${error.message}`);
    } else {
      LoggerHelpers.error(`Error while creating VSCode settings: ${error}`);
    }
  }
} 
