# OptiKit CLI - Safety & Validation Features

## Overview

OptiKit now includes comprehensive safety and validation features to prevent data loss, ensure proper environment setup, and provide users with confidence when running potentially destructive operations.

---

## 🛡️ Pre-Flight Validation

All commands now perform validation checks before executing to ensure the environment is properly configured.

### Validation Types

#### 1. Flutter Project Validation
**Function:** `validateFlutterProject()`
**Checks:**
- `pubspec.yaml` exists in current directory
- `pubspec.yaml` contains Flutter SDK reference

**Used by:** All commands

**Error Messages:**
```
❌ Not a Flutter project: pubspec.yaml not found.
ℹ️  Please run this command from the root of a Flutter project.
```

#### 2. Flutter SDK Validation
**Function:** `validateFlutterSdk(useFvm: boolean)`
**Checks:**
- If using FVM: `.fvm/flutter_sdk` directory exists and `fvm` command available
- If not using FVM: global `flutter` command available

**Used by:** build commands, clean commands

**Error Messages:**
```
❌ FVM Flutter SDK not found at .fvm/flutter_sdk
ℹ️  Run 'fvm install' or use --disable-fvm flag.

OR

❌ Flutter SDK not found.
ℹ️  Install Flutter: https://flutter.dev/docs/get-started/install
```

#### 3. iOS Project Validation
**Function:** `validateIosProject()`
**Checks:**
- `ios/` directory exists
- Either `Runner.xcodeproj` or `Runner.xcworkspace` exists

**Used by:** iOS build commands, iOS clean command, open-ios command

**Error Messages:**
```
❌ iOS project directory not found.
ℹ️  Run 'flutter create .' to add iOS support.
```

#### 4. Android Project Validation
**Function:** `validateAndroidProject()`
**Checks:**
- `android/` directory exists
- Either `build.gradle` or `build.gradle.kts` exists

**Used by:** Android build commands, open-android command

**Error Messages:**
```
❌ Android project directory not found.
ℹ️  Run 'flutter create .' to add Android support.
```

---

## 💾 Automatic Backup System

Critical files are automatically backed up before any destructive operations.

### How It Works

1. **Backup Creation:** Files are copied to `.optikit-backup/` directory with timestamp
2. **Location:** Backups stored in same directory as original file
3. **Naming:** `filename_YYYY-MM-DDTHH-MM-SS-mmmZ.ext`
4. **Retention:** Last 5 backups are kept (configurable)
5. **Cleanup:** Old backups automatically removed

### Backed Up Files

| Command | Files Backed Up |
|---------|----------------|
| `clean-flutter` | `pubspec.lock` |
| `flutter-update-version` | `pubspec.yaml`, `ios/Runner.xcodeproj/project.pbxproj`, `ios/Runner/Info.plist` |

### Example Backup Structure

```
your-flutter-project/
├── pubspec.yaml
├── .optikit-backup/
│   ├── pubspec_2025-12-23T10-30-00-000Z.yaml
│   ├── pubspec_2025-12-23T11-15-30-000Z.yaml
│   └── pubspec_2025-12-23T12-45-10-000Z.yaml
├── ios/
│   ├── Runner.xcodeproj/
│   │   ├── project.pbxproj
│   │   └── .optikit-backup/
│   │       └── project_2025-12-23T10-30-00-000Z.pbxproj
│   └── Runner/
│       ├── Info.plist
│       └── .optikit-backup/
│           └── Info_2025-12-23T10-30-00-000Z.plist
```

### Backup Functions

#### Create Backup
```typescript
createBackup(filePath: string): string | null
```
- Creates timestamped backup of file
- Returns backup path on success, null on failure
- Automatically creates `.optikit-backup/` directory

#### Restore Backup
```typescript
restoreBackup(originalPath: string, backupPath: string): boolean
```
- Copies backup file back to original location
- Returns true on success, false on failure

#### Cleanup Old Backups
```typescript
cleanupBackups(directory: string, keepCount: number = 5): void
```
- Removes old backups beyond keepCount
- Keeps most recent backups
- Called automatically (can be manual too)

---

## ⚠️ Overwrite Warnings

Commands that may overwrite existing data now display warnings.

### Module Generation

**Command:** `optikit generate module <moduleName>`

**Warnings:**
```
⚠️  Module user_profile already exists at lib/module/user_profile
ℹ️  Files will be overwritten...
```

Users are informed when modules will be overwritten, giving them a chance to cancel (Ctrl+C).

### VSCode Settings

**Command:** `optikit setup-vscode`

**Messages:**
```
ℹ️  .vscode directory already exists.
```

Informs users when directories already exist before proceeding.

---

## 🔍 Validation Module API

### Location
[src/utils/validationHelpers.ts](src/utils/validationHelpers.ts)

### Functions

```typescript
// Validates Flutter project structure
validateFlutterProject(): boolean

// Validates Flutter SDK availability
validateFlutterSdk(useFvm: boolean = false): Promise<boolean>

// Validates iOS project exists
validateIosProject(): boolean

// Validates Android project exists
validateAndroidProject(): boolean

// Check if specific file exists
checkFileExists(filePath: string): boolean
```

### Usage Example

```typescript
import { validateFlutterProject, validateFlutterSdk } from "../utils/validationHelpers.js";

async function myCommand(noFvm: boolean) {
  // Pre-flight validation
  if (!validateFlutterProject()) {
    process.exit(1);
  }

  if (!(await validateFlutterSdk(!noFvm))) {
    process.exit(1);
  }

  // Proceed with command...
}
```

---

## 💼 Backup Module API

### Location
[src/utils/backupHelpers.ts](src/utils/backupHelpers.ts)

### Functions

```typescript
// Create timestamped backup
createBackup(filePath: string): string | null

// Restore from backup
restoreBackup(originalPath: string, backupPath: string): boolean

// Clean up old backups
cleanupBackups(directory: string, keepCount: number = 5): void

// Get backup directory path
getBackupPath(filePath: string): string
```

### Usage Example

```typescript
import { createBackup } from "../utils/backupHelpers.js";

async function updateConfigFile() {
  const configPath = "pubspec.yaml";

  // Create backup before modification
  const backupPath = createBackup(configPath);

  if (!backupPath) {
    LoggerHelpers.error("Failed to create backup");
    process.exit(1);
  }

  // Safely modify file...
  fs.writeFileSync(configPath, newContent);
}
```

---

## 🎯 Command-Specific Safety Features

### Build Commands
**Validation:**
- ✅ Flutter project exists
- ✅ Flutter SDK available (FVM or global)
- ✅ Platform project exists (iOS or Android)

**No backups:** Build commands don't modify source files

### Clean Commands
**Validation:**
- ✅ Flutter project exists
- ✅ Flutter SDK available

**Backups:**
- `pubspec.lock` (before deletion)

**Step-by-step logging:** Each operation logged individually for clarity

### Version Update
**Validation:**
- ✅ Flutter project exists
- ✅ Files exist before modification

**Backups:**
- `pubspec.yaml`
- `ios/Runner.xcodeproj/project.pbxproj`
- `ios/Runner/Info.plist`

### Module Generation
**Validation:**
- ✅ Module name format (lowercase, numbers, underscores only)
- ✅ Module name not empty

**Warnings:**
- Module already exists (will overwrite)

### Open Project Commands
**Validation:**
- ✅ Flutter project exists
- ✅ Platform project exists (iOS or Android)

---

## 📋 Error Handling Flow

```
1. Command invoked
   ↓
2. Pre-flight validation
   ├─ ❌ Validation fails → Clear error message → Exit with code 1
   └─ ✅ Validation passes
      ↓
3. Backup critical files (if destructive operation)
   ├─ ❌ Backup fails → Warning logged → Continue (user decision)
   └─ ✅ Backup succeeds
      ↓
4. Execute command
   ├─ ❌ Command fails → Detailed error → Exit with code 1
   └─ ✅ Command succeeds
      ↓
5. Success message → Exit with code 0
```

---

## 🚀 Benefits

### For Users
1. **Confidence:** Know that files are backed up before changes
2. **Clarity:** Clear error messages when something is missing
3. **Safety:** Prevent accidental data loss
4. **Recovery:** Easy restoration from backups if needed

### For Developers
1. **Reusable:** Validation and backup utilities can be used across commands
2. **Consistent:** Same patterns applied everywhere
3. **Maintainable:** Centralized validation logic
4. **Testable:** Functions can be unit tested

### For CI/CD
1. **Fail Fast:** Invalid environments caught immediately
2. **Clear Errors:** Detailed messages for debugging
3. **Proper Exit Codes:** Scripts can handle failures correctly

---

## 📝 Best Practices

### When Adding New Commands

1. **Always validate** appropriate project structure
2. **Backup files** before modifying them
3. **Log each step** for better user feedback
4. **Exit with code 1** on errors
5. **Provide helpful** error messages with suggestions

### For End Users

1. **Review backups** in `.optikit-backup/` directories
2. **Keep backups in .gitignore** (already configured)
3. **Don't rely on backups** for critical data (use git!)
4. **Report issues** if validation is too strict

---

## 🔧 Configuration

Currently, configuration is hardcoded but can be made configurable in the future:

- Backup retention count: 5 backups
- Backup location: `.optikit-backup/` in same directory as original file
- Timestamp format: ISO 8601 with special characters replaced

---

## 📌 Future Enhancements

Potential improvements for safety features:

1. **Interactive Prompts:** Ask user confirmation before destructive operations
2. **Dry-run Mode:** Preview changes without executing
3. **Backup Compression:** Compress old backups to save space
4. **Backup Export:** Export all backups to external location
5. **Rollback Command:** Easy command to restore from last backup
6. **Config File:** User-configurable safety settings
7. **Backup Metadata:** Track what command created each backup
8. **Smart Cleanup:** Clean backups based on age and importance

---

**Version:** 1.1.1+safety
**Last Updated:** December 23, 2025
**Status:** ✅ Production Ready
