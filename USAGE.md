# Usage Guide for OptiKit CLI

The **OptiKit CLI Tool** provides several commands to help streamline your development workflow. This guide explains how to use the tool, including all available commands and their respective options.

Each command is designed to simplify tasks like building Flutter projects, generating modules, managing versions, and automating other aspects of your workflow. Below, you'll find detailed explanations and examples for each command supported by **OptiKit CLI**.

After installing OptiKit, you can use it directly from the command line.

---

## Table of Contents

- [Configuration Commands](#configuration-commands)
- [Version Management Commands](#version-management-commands)
- [Device Management Commands](#device-management-commands)
- [Build Commands](#build-commands)
- [Clean Commands](#clean-commands)
- [Project Commands](#project-commands)

---

## Configuration Commands

### Initialize OptiKit Configuration

Create `.optikitrc.json` configuration file in your project:

```bash
optikit init
```

**What it does:**

- Creates configuration file with default settings
- Adds `.optikit-backup/` to `.gitignore`
- Sets up automatic backups and retention policies

**Default configuration:**

```json
{
  "backupRetentionCount": 5,
  "useFvmByDefault": true,
  "autoBackup": true,
  "verbose": false
}
```

---

### Manage Backups

List all available backups:

```bash
optikit rollback
```

Restore a specific backup:

```bash
optikit rollback --restore <number>
```

**What it does:**

- Recursively searches for all OptiKit backups
- Groups backups by original file
- Shows timestamps and file sizes
- Allows easy restoration by number

---

## Version Management Commands

For detailed version management strategies, see [VERSION_MANAGEMENT.md](VERSION_MANAGEMENT.md).

### Show Current Version

Display current version information:

```bash
optikit version
```

**Output:**

```text
📱 Current Version Information

Version: 1.2.3+45
  Major: 1
  Minor: 2
  Patch: 3
  Build: 45
```

---

### Bump Version (Semantic Versioning)

Increment patch version (bug fixes):

```bash
optikit bump patch
```

Increment minor version (new features):

```bash
optikit bump minor
```

Increment major version (breaking changes):

```bash
optikit bump major
```

**What it does:**

- Updates version in pubspec.yaml
- Increments Android build number
- **Resets iOS build number to 1** (new version = fresh start)
- Updates iOS project files (project.pbxproj, Info.plist)
- Creates automatic backups before changes

**Example:**

```text
Current: 1.0.2+45
After `optikit bump patch`:
New: 1.0.3+46 (iOS build: 1)
```

---

### Bump iOS Build Only (TestFlight)

Increment only iOS build number without changing version:

```bash
optikit bump-ios
```

**What it does:**

- Keeps version unchanged
- Keeps Android build number unchanged
- **Increments iOS build from current Android build number**
- Perfect for multiple TestFlight uploads

**Example:**

```text
Before:
  Version: 1.0.2+45
  iOS build: 1

After:
  Version: 1.0.2+45 (unchanged)
  iOS build: 46 (incremented from 45)
```

---

### Bump Android Build Only

Increment only Android build number:

```bash
optikit bump-android
```

**What it does:**

- Keeps version unchanged
- Keeps iOS build number unchanged
- Increments Android build number
- Perfect for Google Play uploads

**Example:**

```text
Before: 1.0.2+45 (iOS: 1)
After: 1.0.2+46 (iOS: 1 unchanged)
```

---

### Bump Both Build Numbers

Increment both Android and iOS build numbers:

```bash
optikit bump-build
```

**What it does:**

- Keeps version unchanged
- Increments Android build number
- Increments iOS build number
- Perfect for simultaneous Android and iOS releases

**Example:**

```text
Before: 1.0.2+45 (iOS: 3)
After: 1.0.2+46 (iOS: 4)
```

---

## Build Commands

All build commands support FVM and create automatic backups.

### Build Flutter APK for Release

By default, the build command will use FVM for Flutter commands:

```bash
optikit flutter-build-apk
```

To run the build command without FVM, use the `--disable-fvm` flag:

```bash
optikit flutter-build-apk --disable-fvm
```

---

### Build Flutter Bundle for Release

By default, the build command will use FVM for Flutter commands:

```bash
optikit flutter-build-bundle
```

To run the build command without FVM, use the `--disable-fvm` flag:

```bash
optikit flutter-build-bundle --disable-fvm
```

---

### Build Flutter iOS App for Release

By default, the build command will use FVM for Flutter commands:

```bash
optikit flutter-build-ios
```

To run the build command without FVM, use the `--disable-fvm` flag:

```bash
optikit flutter-build-ios --disable-fvm
```

---

### Create a Release IPA for Flutter App

By default, the build command will use FVM for Flutter commands:

```bash
optikit flutter-build-ipa
```

To run the build command without FVM, use the `--disable-fvm` flag:

```bash
optikit flutter-build-ipa --disable-fvm
```

---

## Clean Commands

### Clean Flutter Project

By default, the clean command will use FVM for Flutter commands:

```bash
optikit clean-flutter
```

To run the clean command without FVM, use the `--disable-fvm` flag:

```bash
optikit clean-flutter --disable-fvm
```

---

### Clean the iOS Project

By default, the clean command will not clean CocoaPods cache:

```bash
optikit clean-ios
```

To clean with CocoaPods cache, use the `--clean-cache` flag:

```bash
optikit clean-ios --clean-cache
```

To update repositories during cleaning, use the `--repo-update` flag:

```bash
optikit clean-ios --repo-update
```

---

## Project Commands

### Generate a New Module

To generate a new module, run:

```bash
optikit generate module <module_name>
```

Replace `<module_name>` with the desired name for your module.

---

### Open Android Project in Android Studio

Open the Android module of your Flutter project in Android Studio:

```bash
optikit open-android
```

---

### Open iOS Project in Xcode

Open the iOS module of your Flutter project in Xcode:

```bash
optikit open-ios
```

---

### Open Build Output Directories

Quickly access your build artifacts in Finder (macOS), File Explorer (Windows), or your default file manager (Linux).

**Open IPA build output:**

```bash
optikit open-ipa
```

Opens: `build/ios/ipa/`

**Open APK build output:**

```bash
optikit open-apk
```

Opens: `build/app/outputs/flutter-apk/`

**Open Android Bundle build output:**

```bash
optikit open-bundle
```

Opens: `build/app/outputs/bundle/release/`

**What it does:**

- Validates that you're in a Flutter project
- Checks if the build output directory exists
- Opens the directory in your system's default file manager
- Works cross-platform (macOS, Windows, Linux)

**Note:** You must build the respective artifact first before opening its output directory.

---

### VS Code Setup Command

Automatically create a `.vscode` folder with a `settings.json` file preconfigured for Flutter projects using FVM. This command streamlines your project setup by setting the Flutter SDK path to `.fvm/flutter_sdk`.

```bash
optikit setup-vscode
```

---

## Verification

After running any command, you can verify its success by observing the output or using the `optikit --version` command to confirm the CLI's version.

---

Enjoy using **OptiKit CLI** to enhance your development workflow!
