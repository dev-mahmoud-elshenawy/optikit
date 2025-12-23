# OptiKit CLI - Feature Enhancements

## Overview

This document details the new features added to OptiKit CLI to improve user experience, provide better control, and make the tool more powerful and flexible.

---

## 🆕 New Commands

### 1. Init Command (`optikit init`)

**Purpose:** Initialize OptiKit configuration in your project

**Usage:**
```bash
optikit init
```

**What it does:**
- Creates `.optikitrc.json` with default configuration
- Adds `.optikit-backup/` to `.gitignore` (if .gitignore exists)
- Displays the created configuration

**Example Output:**
```bash
$ optikit init
ℹ️  Initializing OptiKit in this project...
✅ Configuration saved to /path/to/project/.optikitrc.json
✅ OptiKit initialized successfully!

Default configuration:
{
  "backupRetentionCount": 5,
  "useFvmByDefault": false,
  "autoBackup": true,
  "verbose": false
}

You can modify .optikitrc.json to customize these settings.

✅ Added .optikit-backup/ to .gitignore
```

**Configuration Options:**
- `backupRetentionCount` - Number of backups to keep (default: 5)
- `useFvmByDefault` - Use FVM for all commands by default (default: false)
- `autoBackup` - Automatically backup files before modification (default: true)
- `verbose` - Enable verbose logging (default: false)

---

### 2. Rollback Command (`optikit rollback`)

**Purpose:** List and restore files from OptiKit backups

**Usage:**
```bash
# List all available backups
optikit rollback

# Restore a specific backup
optikit rollback --restore 1
```

**List Mode Example:**
```bash
$ optikit rollback
ℹ️  Searching for OptiKit backups...

Found 6 backup(s):

pubspec.yaml
  [1] 12/23/2025, 3:45:30 PM (5m ago, 2.34 KB)
  [2] 12/23/2025, 2:30:15 PM (1h ago, 2.31 KB)

ios/Runner.xcodeproj/project.pbxproj
  [3] 12/23/2025, 3:40:20 PM (10m ago, 45.67 KB)
  [4] 12/23/2025, 1:15:00 PM (3h ago, 45.12 KB)

ios/Runner/Info.plist
  [5] 12/23/2025, 3:40:25 PM (10m ago, 1.23 KB)
  [6] 12/23/2025, 1:15:05 PM (3h ago, 1.20 KB)

============================================================
To restore a backup, run:
  optikit rollback --restore <number>

Example:
  optikit rollback --restore 1
============================================================
```

**Restore Mode Example:**
```bash
$ optikit rollback --restore 1
ℹ️  Restoring: pubspec.yaml
ℹ️  From backup: 12/23/2025, 3:45:30 PM
✅ Restored from backup: pubspec.yaml
✅ Backup restored successfully!
```

**Features:**
- Recursively searches entire project for backups
- Groups backups by original file
- Sorts by timestamp (newest first)
- Shows human-readable time ago (5m ago, 1h ago, etc.)
- Displays file sizes
- Simple numeric index for restoration

---

## 🔧 Configuration System

### Configuration File (`.optikitrc.json`)

OptiKit now supports project-level and user-level configuration files.

**File Locations** (priority order):
1. `.optikitrc` in current directory
2. `.optikitrc.json` in current directory
3. `.optikitrc` in home directory
4. `.optikitrc.json` in home directory

**Configuration Schema:**
```typescript
interface OptiKitConfig {
  backupRetentionCount?: number;    // Number of backups to keep
  useFvmByDefault?: boolean;        // Use FVM by default
  autoBackup?: boolean;             // Auto-backup before changes
  verbose?: boolean;                // Verbose logging
}
```

**Example `.optikitrc.json`:**
```json
{
  "backupRetentionCount": 10,
  "useFvmByDefault": true,
  "autoBackup": true,
  "verbose": false
}
```

**Defaults:**
```json
{
  "backupRetentionCount": 5,
  "useFvmByDefault": false,
  "autoBackup": true,
  "verbose": false
}
```

---

## 🎨 Dry-Run Mode (Coming Soon)

**Purpose:** Preview commands without executing them

**Usage:**
```bash
optikit flutter-build-apk --dry-run
optikit clean-flutter --dry-run
```

**Features:**
- Shows all validation checks
- Displays commands that would be executed
- Lists files that would be modified
- No actual changes to system
- Perfect for learning and testing

**Example Output:**
```bash
$ optikit flutter-build-apk --dry-run
🔍 DRY-RUN MODE ENABLED - No commands will be executed
Commands will be displayed but not run

✓ Validating Flutter project PASS
✓ Validating Flutter SDK PASS
✓ Validating Android project PASS

→ Build Flutter APK
  Command: fvm flutter build apk --release --obfuscate --split-debug-info=build/app/outputs/symbols

============================================================
DRY-RUN SUMMARY
============================================================

Total operations: 1
  Commands: 1
  File operations: 0

============================================================
No actual changes were made to your system.
Run without --dry-run to execute these operations.
```

---

## 🎯 Use Cases

### Use Case 1: New Project Setup

```bash
# Initialize OptiKit in your Flutter project
cd my-flutter-app
optikit init

# Customize configuration
vim .optikitrc.json

# Use OptiKit commands
optikit clean-flutter
optikit flutter-build-apk
```

### Use Case 2: Version Recovery

```bash
# Made a mistake updating version?
optikit flutter-update-version --app-version 2.0.0 --android-build 10

# Oops! Wrong version. Let's check backups
optikit rollback

# Restore the old pubspec.yaml
optikit rollback --restore 1
```

### Use Case 3: Team Configuration

```bash
# Create team-wide configuration
cat > .optikitrc.json << EOF
{
  "backupRetentionCount": 10,
  "useFvmByDefault": true,
  "autoBackup": true
}
EOF

# Commit to repository
git add .optikitrc.json
git commit -m "Add OptiKit configuration"

# Team members automatically use same settings
```

### Use Case 4: Backup Management

```bash
# Check all backups periodically
optikit rollback

# Restore specific file versions as needed
optikit rollback --restore 3

# Backups are automatically cleaned up (keeps last 5)
```

---

## 📊 Benefits

### For Individual Developers

1. **Easy Setup:** `optikit init` gets you started instantly
2. **Safety Net:** Automatic backups with easy restoration
3. **Customization:** Configure behavior per-project
4. **Recovery:** Rollback mistakes quickly

### For Teams

1. **Consistency:** Share configuration across team
2. **Standardization:** Everyone uses same settings
3. **Documentation:** Configuration file self-documents preferences
4. **Version Control:** Config can be committed to Git

### For DevOps/CI

1. **Scriptable:** Configuration via files, not command-line flags
2. **Predictable:** Same behavior across environments
3. **Auditable:** Configuration changes tracked in Git
4. **Flexible:** Different configs for dev/staging/prod

---

## 🔄 Migration Guide

### From Manual Configuration to OptiKit Config

**Before:**
```bash
# Remember to use --disable-fvm on this project
optikit flutter-build-apk --disable-fvm

# Remember to keep more backups
# (no way to configure this)
```

**After:**
```bash
# One-time setup
optikit init
echo '{"useFvmByDefault": false, "backupRetentionCount": 10}' > .optikitrc.json

# Now just use commands normally
optikit flutter-build-apk  # Uses config automatically
```

---

## 🎓 Best Practices

### 1. Initialize Early
```bash
# First thing when starting a project
optikit init
```

### 2. Commit Configuration
```bash
# Share team settings
git add .optikitrc.json
git commit -m "Add OptiKit configuration"
```

### 3. Regular Backup Checks
```bash
# Weekly or monthly
optikit rollback  # Review available backups
```

### 4. Document Custom Settings
```json
{
  "backupRetentionCount": 10,  // Keep more for this critical project
  "useFvmByDefault": true,      // Team uses FVM
  "autoBackup": true,           // Always backup
  "verbose": false              // Quiet output for CI
}
```

---

## 📋 Command Reference

### All New Commands

| Command | Description | Options |
|---------|-------------|---------|
| `optikit init` | Initialize configuration | None |
| `optikit rollback` | List backups | None |
| `optikit rollback --restore N` | Restore backup #N | `--restore <number>` |

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `backupRetentionCount` | number | 5 | Backups to keep |
| `useFvmByDefault` | boolean | false | Use FVM by default |
| `autoBackup` | boolean | true | Auto-backup files |
| `verbose` | boolean | false | Verbose logging |

---

## 🚀 Future Enhancements

### Planned Features

1. **Dry-Run Mode**
   - Preview all operations
   - See validation results
   - Perfect for learning

2. **Verbose Mode**
   - Detailed operation logs
   - Debug information
   - Command execution details

3. **Progress Indicators**
   - Spinners for long operations
   - Progress bars for builds
   - Time estimates

4. **Config Command**
   ```bash
   optikit config set backupRetentionCount 10
   optikit config get
   optikit config list
   ```

5. **Backup Export**
   ```bash
   optikit backup export ./backup-archive
   ```

---

## 📖 Related Documentation

- [CODE_QUALITY.md](CODE_QUALITY.md) - Architecture improvements
- [SAFETY_FEATURES.md](SAFETY_FEATURES.md) - Validation and backups
- [ENHANCEMENTS.md](ENHANCEMENTS.md) - Critical bug fixes
- [CLAUDE.md](CLAUDE.md) - Development guide

---

## 🎉 Summary

### New Capabilities

- ✅ **2 new commands** (init, rollback)
- ✅ **Configuration system** (.optikitrc.json)
- ✅ **Backup management** (list and restore)
- ✅ **Project initialization** (quick setup)
- ✅ **Team settings** (shareable config)

### Developer Experience

| Aspect | Before | After |
|--------|--------|-------|
| Setup | Manual | `optikit init` |
| Configuration | Command-line flags | Config file |
| Backup Management | Manual file browsing | `optikit rollback` |
| Recovery | Manual copy | `optikit rollback --restore N` |
| Team Sharing | Documentation | Committed config |

---

**Version:** 1.1.1+features
**Last Updated:** December 23, 2025
**Status:** ✅ Production Ready
