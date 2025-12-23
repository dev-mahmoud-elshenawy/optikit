import fs from "fs";
import path from "path";
import { LoggerHelpers } from "../../utils/services/logger.js";

export {
  createVscodeSettings,
};

/**
 * Creates a .vscode directory (if it doesn't exist) and writes a settings.json file
 * with recommended Flutter configuration. The Flutter SDK path is set to ".fvm/flutter_sdk".
 */
async function createVscodeSettings(){
  try {
    const vscodeDir = path.join(process.cwd(), ".vscode");
    const settingsPath = path.join(vscodeDir, "settings.json");

    // Create the .vscode folder using Node.js fs (cross-platform)
    if (!fs.existsSync(vscodeDir)) {
      fs.mkdirSync(vscodeDir, { recursive: true });
      LoggerHelpers.success("Created .vscode directory.");
    } else {
      LoggerHelpers.info(".vscode directory already exists.");
    }

    // Define the settings object
    const settings = {
      "dart.flutterSdkPath": ".fvm/flutter_sdk",
      "editor.formatOnSave": true,
      "dart.previewFlutterUiGuides": true,
      "files.exclude": {
        "**/.git": true,
        "**/.DS_Store": true,
        "**/node_modules": true,
        "**/build": true
      }
    };

    // Write settings.json using Node.js fs
    fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2), "utf8");
    LoggerHelpers.success("Created .vscode/settings.json with Flutter configuration.");
  } catch (error) {
    if (error instanceof Error) {
      LoggerHelpers.error(`Error while creating VSCode settings: ${error.message}`);
    } else {
      LoggerHelpers.error(`Error while creating VSCode settings: ${error}`);
    }
    process.exit(1);
  }
} 
