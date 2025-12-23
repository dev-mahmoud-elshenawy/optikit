#!/usr/bin/env node

import chalk from "chalk";
import boxen from "boxen";
import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";
import { generateModule } from "./commands/project/generate.js";
import { cleanProject } from "./commands/clean/flutter.js";
import { cleanIosProject } from "./commands/clean/ios.js";
import { updateFlutterVersion } from "./commands/version/update.js";
import {
  buildFlutterApk,
  buildFlutterBundle,
  buildFlutterIos,
  buildFlutterIpa,
} from "./commands/build/releases.js";
import { boxenOptions } from "./styles.js";
import { openIos, openAndroid } from "./commands/project/open.js";
import { createRequire } from "module";
import { createVscodeSettings } from "./commands/project/setup.js";
import { initializeProject } from "./commands/config/init.js";
import { rollbackFiles, rollbackRestore } from "./commands/config/rollback.js";
import {
  bumpVersion,
  bumpIosBuildOnly,
  bumpAndroidBuildOnly,
  showCurrentVersion
} from "./commands/version/bump.js";
import { listDevices, runApp, runAppInteractive } from "./commands/project/devices.js";
const require = createRequire(import.meta.url);
const packageInfo: { version: string } = require("../package.json");

const version = packageInfo.version;

const greeting = chalk.white.bold("Hello ^_^");
console.log(boxen(greeting, boxenOptions));

const options = yargs(hideBin(process.argv))
  .command(
    "generate module <moduleName>",
    "Generate a module with structure",
    (yargs) => {
      return yargs.positional("moduleName", {
        describe: "The name of the module to generate",
        type: "string",
      });
    },
    (argv) => {
      const moduleName = argv.moduleName as string;
      generateModule(moduleName);
    }
  )
  .command(
    "clean-flutter",
    "Clean the Flutter project",
    (yargs) => {
      return yargs.option("disable-fvm", {
        type: "boolean",
        default: false,
        description: "Run without FVM (use --disable-fvm to enable)",
      });
    },
    (argv) => {
      const noFvm = argv.disableFvm as boolean;
      cleanProject(noFvm);
    }
  )
  .command(
    "clean-ios",
    "Clean the iOS project",
    (yargs) => {
      return yargs
        .option("clean-cache", {
          type: "boolean",
          default: false,
          description:
            "Run with CocoaPods cache cleaning (use --clean-cache to enable)",
        })
        .option("repo-update", {
          type: "boolean",
          default: false,
          description:
            "Run pod install with repository update (use --repo-update to enable)",
        });
    },
    (argv) => {
      const cleanCache = argv.cleanCache as boolean;
      const repoUpdate = argv.repoUpdate as boolean;
      cleanIosProject(cleanCache, repoUpdate);
    }
  )
  .command(
    "flutter-build-apk",
    "Build the Flutter APK with release configuration, obfuscation, and split debug info",
    (yargs) => {
      return yargs.option("disable-fvm", {
        type: "boolean",
        default: false,
        description: "Run without FVM (use --disable-fvm to enable)",
      });
    },
    async (argv) => {
      const noFvm = argv.disableFvm as boolean;
      await buildFlutterApk(noFvm);
    }
  )
  .command(
    "flutter-build-bundle",
    "Build the Flutter Bundle with release configuration, obfuscation, and split debug info",
    (yargs) => {
      return yargs.option("disable-fvm", {
        type: "boolean",
        default: false,
        description: "Run without FVM (use --disable-fvm to enable)",
      });
    },
    async (argv) => {
      const noFvm = argv.disableFvm as boolean;
      await buildFlutterBundle(noFvm);
    }
  )
  .command(
    "flutter-build-ios",
    "Build the Flutter iOS app with release configuration and increment the build version",
    (yargs) => {
      return yargs.option("disable-fvm", {
        type: "boolean",
        default: false,
        description: "Run without FVM (use --disable-fvm to enable)",
      });
    },
    async (argv) => {
      const noFvm = argv.disableFvm as boolean;
      await buildFlutterIos(noFvm);
    }
  )
  .command(
    "flutter-build-ipa",
    "Create a release IPA with an updated build version number",
    (yargs) => {
      return yargs.option("disable-fvm", {
        type: "boolean",
        default: false,
        description: "Run without FVM (use --disable-fvm to enable)",
      });
    },
    async (argv) => {
      const noFvm = argv.disableFvm as boolean;
      await buildFlutterIpa(noFvm);
    }
  )
  .command(
    "flutter-update-version",
    "Update version and build numbers for both Android and iOS",
    (yargs) => {
      return yargs
        .option("app-version", {
          type: "string",
          description: "The version number to set for both Android and iOS",
          demandOption: false,
          default: "",
        })
        .option("android-build", {
          type: "string",
          description: "The Android build number to set in pubspec.yaml",
          demandOption: false,
          default: "",
        })
        .option("ios-build", {
          type: "string",
          description:
            "The iOS build number to set using agv-tool and Info.plist",
          demandOption: false,
          default: "",
        });
    },
    async (argv) => {
      const version = argv["app-version"];
      const androidBuildNumber = argv["android-build"];
      const iosBuildNumber = argv["ios-build"];

      await updateFlutterVersion(version, androidBuildNumber, iosBuildNumber);
    }
  )
  .command("open-ios", "Open the iOS project in Xcode", {}, async () => {
    await openIos();
  })
  .command(
    "open-android",
    "Open the Android project in Android Studio",
    {},
    async () => {
      await openAndroid();
    }
  ).command(
    "setup-vscode",
    "Create a .vscode folder with recommended Flutter settings",
    () => {},
    async () => {
      await createVscodeSettings();
    }
  )
  .command(
    "init",
    "Initialize OptiKit configuration in the current project",
    () => {},
    async () => {
      await initializeProject();
    }
  )
  .command(
    "rollback",
    "List and restore files from OptiKit backups",
    (yargs) => {
      return yargs.option("restore", {
        type: "number",
        description: "Restore backup by index number",
        demandOption: false,
      });
    },
    async (argv) => {
      const restoreIndex = argv.restore as number | undefined;
      if (restoreIndex !== undefined) {
        await rollbackRestore(restoreIndex);
      } else {
        await rollbackFiles();
      }
    }
  )
  .command(
    "version",
    "Show current version information",
    () => {},
    async () => {
      await showCurrentVersion();
    }
  )
  .command(
    "version bump <type>",
    "Bump version (major, minor, or patch)",
    (yargs) => {
      return yargs.positional("type", {
        describe: "Version bump type (major, minor, patch)",
        type: "string",
        choices: ["major", "minor", "patch"],
      });
    },
    async (argv) => {
      const type = argv.type as 'major' | 'minor' | 'patch';
      await bumpVersion(type);
    }
  )
  .command(
    "version bump-ios",
    "Increment iOS build number only (for TestFlight)",
    () => {},
    async () => {
      await bumpIosBuildOnly();
    }
  )
  .command(
    "version bump-android",
    "Increment Android build number only",
    () => {},
    async () => {
      await bumpAndroidBuildOnly();
    }
  )
  .command(
    "devices",
    "List all connected devices",
    (yargs) => {
      return yargs.option("disable-fvm", {
        type: "boolean",
        default: false,
        description: "Run without FVM (use --disable-fvm to enable)",
      });
    },
    async (argv) => {
      const useFvm = !argv.disableFvm;
      await listDevices(useFvm);
    }
  )
  .command(
    "run",
    "Run Flutter app on connected device",
    (yargs) => {
      return yargs
        .option("device", {
          alias: "d",
          type: "string",
          description: "Specific device ID to run on",
        })
        .option("release", {
          alias: "r",
          type: "boolean",
          default: false,
          description: "Run in release mode",
        })
        .option("flavor", {
          alias: "f",
          type: "string",
          description: "Build flavor to use",
        })
        .option("disable-fvm", {
          type: "boolean",
          default: false,
          description: "Run without FVM (use --disable-fvm to enable)",
        });
    },
    async (argv) => {
      const useFvm = !argv.disableFvm;
      await runApp({
        device: argv.device as string | undefined,
        release: argv.release as boolean,
        flavor: argv.flavor as string | undefined,
        useFvm,
      });
    }
  )
  .command(
    "run-select",
    "Interactive device selection and run",
    (yargs) => {
      return yargs
        .option("release", {
          alias: "r",
          type: "boolean",
          default: false,
          description: "Run in release mode",
        })
        .option("flavor", {
          alias: "f",
          type: "string",
          description: "Build flavor to use",
        })
        .option("disable-fvm", {
          type: "boolean",
          default: false,
          description: "Run without FVM (use --disable-fvm to enable)",
        });
    },
    async (argv) => {
      const useFvm = !argv.disableFvm;
      await runAppInteractive({
        release: argv.release as boolean,
        flavor: argv.flavor as string | undefined,
        useFvm,
      });
    }
  )
  .version(version)
  .help(true).argv;
