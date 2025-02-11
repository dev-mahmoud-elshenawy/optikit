#!/usr/bin/env node

import chalk from "chalk";
import boxen from "boxen";
import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";
import { generateModule } from "./commands/generateModule.js";
import { cleanProject } from "./commands/cleanProject.js";
import { cleanIosProject } from "./commands/cleanProjectIos.js";
import { updateFlutterVersion } from "./commands/updateVersions.js";
import {
  buildFlutterApk,
  buildFlutterBundle,
  buildFlutterIos,
  buildFlutterIpa,
} from "./commands/buildReleases.js";
import { boxenOptions } from "./styles.js";
import { openIos, openAndroid } from "./commands/openProject.js";
import { createRequire } from "module";
import { createVscodeSettings } from "./commands/setupVSCode.js";
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
  .version(version)
  .help(true).argv;
