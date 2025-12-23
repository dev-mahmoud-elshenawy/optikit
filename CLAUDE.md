# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

OptiKit is a TypeScript-based CLI tool for Flutter developers, especially those using the Opticore micro framework. It automates module scaffolding, build processes, and project maintenance tasks.

## Essential Commands

### Development
```bash
npm install              # Install dependencies
npm run build           # Compile TypeScript to dist/
npm start               # Run the CLI (after build)
node dist/cli.js        # Direct execution
```

### Testing the CLI Locally
```bash
npm link                # Create global symlink for testing
optikit <command>       # Test commands globally
npm unlink              # Remove symlink when done
```

### Build Configuration
- TypeScript compiles from `src/` to `dist/`
- Target: ESNext, Module: NodeNext
- Entry point: `src/cli.ts` (shebang for CLI execution)
- Binary: `dist/cli.js` (executable as `optikit` command)

## Architecture

### Folder Structure (Domain-Based Organization)

```
src/
├── cli.ts                          # Main CLI entry point (yargs configuration)
├── constants.ts                    # Centralized constants and configurations
├── styles.ts                       # CLI styling (boxen, chalk)
│
├── commands/                       # Domain-organized command modules
│   ├── build/                      # Build-related commands
│   │   └── releases.ts             # APK, Bundle, IPA, iOS builds
│   ├── clean/                      # Clean-related commands
│   │   ├── flutter.ts              # Flutter project cleaning
│   │   └── ios.ts                  # iOS-specific cleaning
│   ├── version/                    # Version management commands
│   │   ├── bump.ts                 # Smart version bumping (major/minor/patch, iOS/Android)
│   │   └── update.ts               # Manual version updates
│   ├── project/                    # Project-related commands
│   │   ├── generate.ts             # Module generation (BLoC pattern)
│   │   ├── open.ts                 # Open in Xcode/Android Studio
│   │   └── setup.ts                # VSCode settings setup
│   └── config/                     # Configuration commands
│       ├── init.ts                 # Initialize OptiKit config
│       └── rollback.ts             # Backup management
│
└── utils/                          # Categorized utility modules
    ├── validators/                 # Validation utilities
    │   └── validation.ts           # Flutter project, SDK, iOS/Android validation
    ├── helpers/                    # Helper functions
    │   ├── build.ts                # Build execution helpers
    │   ├── dryRun.ts               # Dry-run mode utilities
    │   ├── file.ts                 # File operations (create, write, getClassName)
    │   ├── string.ts               # String manipulation (capitalize, etc.)
    │   └── version.ts              # Version parsing and manipulation
    └── services/                   # Service modules
        ├── backup.ts               # Automatic backup/restore system
        ├── command.ts              # Command validation helpers
        ├── config.ts               # .optikitrc configuration management
        ├── exec.ts                 # Process execution (execCommand, execInIos)
        └── logger.ts               # Colored console output (chalk)
```

### Command Structure
All commands are defined in [src/cli.ts](src/cli.ts) using yargs and implemented in domain-specific modules under `src/commands/`:

**Command Registry Pattern:**
```
cli.ts (yargs configuration)
  ├── Import command modules from domain folders
  └── Define command specs with:
      ├── Command name and arguments
      ├── Options (flags like --disable-fvm)
      └── Handler function (calls command module)
```

### Module Generation System
The `generate module` command creates a complete BLoC pattern structure for Opticore framework:

**Generated Structure:**
```
lib/module/<moduleName>/
  ├── bloc/        # BLoC implementation
  ├── event/       # Event definitions
  ├── state/       # State definitions
  ├── screen/      # UI screen widgets
  ├── factory/     # State factory
  └── import/      # Centralized imports file
```

**Template System:**

- Each component type has a template in [src/commands/project/generate.ts](src/commands/project/generate.ts)
- Uses `part of` syntax linking to central import file
- Class names auto-generated via `getClassName()` utility
- All files use `.dart` extension and follow Opticore patterns

### Utility Modules

#### Validators (src/utils/validators/)

**validation.ts** - Pre-flight validation system:

- `validateFlutterProject()` - Checks for pubspec.yaml
- `validateFlutterSdk(useFvm)` - Validates Flutter/FVM installation
- `validateIosProject()` - Checks iOS project structure
- `validateAndroidProject()` - Checks Android project structure

#### Helpers (src/utils/helpers/)

**exec.ts** (in services/) - Process execution with three patterns:

1. `execCommand(command)` - Spawns shell command with streaming output
2. `execInIos(command)` - Runs command in `ios/` directory with 10min timeout
3. `execInIosWithRetry(command, retries, delay)` - Retry wrapper for flaky network operations

**file.ts** - File operations:

- `createDirectories(basePath, dirs)` - Recursive directory creation
- `writeFile(path, content)` - Write with error handling
- `getClassName(moduleName, suffix)` - Converts snake_case to PascalCase (e.g., "user_profile" → "UserProfileBloc")

**version.ts** - Version management:

- `parseVersion(versionString)` - Parses version in X.Y.Z+B format
- `incrementVersion(current, type)` - Handles major/minor/patch increments
- `getCurrentVersion()` - Reads version from pubspec.yaml
- `formatVersion(version)` - Formats version to string

**build.ts** - Build execution:

- `executeBuild(config, noFvm)` - Unified build execution with validation

**string.ts** - String utilities (capitalize, etc.)

#### Services (src/utils/services/)

**logger.ts** - Colored console output using chalk:

- `.success()` - Green
- `.error()` - Red
- `.warning()` - Yellow
- `.info()` - Light blue

**backup.ts** - Automatic backup system:

- `createBackup(filePath)` - Creates timestamped backups in .optikit-backup/
- `restoreBackup(originalPath, backupPath)` - Restores from backup
- `cleanupBackups(directory, retentionCount)` - Maintains backup retention limit

**config.ts** - Configuration management:

- `loadConfig()` - Loads .optikitrc.json from project or home directory
- `saveConfig(config)` - Saves configuration to file
- Priority: project .optikitrc → project .optikitrc.json → home directory versions

**command.ts** - Command utilities:

- Validation and command helpers

### FVM Support Pattern
Most Flutter commands support `--disable-fvm` flag:
- Default: Prepends `fvm` to Flutter/Dart commands
- With flag: Uses global Flutter SDK
- Used in: build commands, clean commands

### Version Management Flow
The `flutter-update-version` command handles cross-platform versioning:
1. Updates `pubspec.yaml` (version + build number)
2. Updates `ios/Runner.xcodeproj/project.pbxproj` (MARKETING_VERSION, CURRENT_PROJECT_VERSION)
3. Updates `ios/Runner/Info.plist` (CFBundleShortVersionString, CFBundleVersion)
4. Runs `agvtool` commands in iOS directory for Xcode build settings

### iOS Build Pattern
iOS commands use retry logic due to CocoaPods network instability:
- Default: 3 retries with 5s delay
- All iOS operations run in `ios/` directory via `execInIos()`
- 10-minute timeout for pod operations

## File Naming Conventions

### TypeScript Files (Domain-Based)

**Commands** - Organized by domain in `src/commands/`:

- `build/releases.ts` - Build commands
- `clean/flutter.ts`, `clean/ios.ts` - Clean commands
- `version/bump.ts`, `version/update.ts` - Version commands
- `project/generate.ts`, `project/open.ts`, `project/setup.ts` - Project commands
- `config/init.ts`, `config/rollback.ts` - Configuration commands

**Utilities** - Categorized in `src/utils/`:

- `validators/validation.ts` - Validation utilities
- `helpers/*.ts` - Helper functions (build, file, string, version, dryRun)
- `services/*.ts` - Service modules (backup, command, config, exec, logger)
- All modules use ES6 imports with `.js` extension (TypeScript quirk for NodeNext)

### Generated Dart Files

- Pattern: `<moduleName>_<type>.dart`
- Types: `bloc`, `event`, `state`, `screen`, `factory`, `import`
- Example: For module "user_profile" → `user_profile_bloc.dart`

## Adding New Commands

1. **Choose the appropriate domain folder** in `src/commands/` (build, clean, version, project, config)
2. **Create command module** in that folder (e.g., `src/commands/build/newBuild.ts`)
3. **Import in [src/cli.ts](src/cli.ts)** using the new path (e.g., `./commands/build/newBuild.js`)
4. **Add `.command()` block** with:
   - Command signature
   - Description
   - Options configuration
   - Handler calling your module function
5. **Use categorized utilities**:
   - `LoggerHelpers` from `../utils/services/logger.js` for console output
   - `execCommand()` from `../utils/services/exec.js` for shell operations
   - `validateFlutterProject()` from `../utils/validators/validation.js` for validation
   - `createBackup()` from `../utils/services/backup.js` for backups

## Important Notes

- **ES Modules**: Project uses `"type": "module"` - all imports need `.js` extension
- **Path Construction**: Use `path.join()` for cross-platform compatibility
- **Error Handling**: Wrap async operations in try-catch, log with `LoggerHelpers.error()`
- **Process Execution**: Never use `exec()` directly - use helper functions for consistent output streaming
- **Opticore Framework**: Generated modules assume Opticore package is installed in target Flutter project
