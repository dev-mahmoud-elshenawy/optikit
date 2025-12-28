# Changelog

All notable changes to this project are documented in this file. Each release includes details about new features, improvements, bug fixes, and any breaking changes. This changelog helps users and developers track the evolution of the project and understand how different versions may impact their use of the tool.

We follow Semantic Versioning (SemVer) to indicate the nature of changes:

	•	MAJOR: Breaking changes that may affect compatibility.
	•	MINOR: New features or improvements that are backward compatible.
	•	PATCH: Bug fixes and minor improvements that are backward compatible.

Each section lists the changes in chronological order, with the most recent release at the top. We also include links to relevant discussions or issues when appropriate.

## [1.2.5]

### Added

- **Simultaneous Build Number Bump:** New `bump-build` command that increments both Android and iOS build numbers simultaneously without changing the version number
- **Comprehensive Documentation:** Updated USAGE.md with detailed section for the new bump-build command

### Improved

- **Build Number Management:** Enhanced flexibility for managing builds across both platforms with a single command

## [1.2.4]

### Fixed

- **iOS Build Number Tracking:** Fixed `bump-ios` command to increment the actual iOS build number from `project.pbxproj` instead of deriving from Android build number
- **Independent Platform Builds:** iOS and Android build numbers now tracked independently as intended

### Added

- **iOS Build Number Reader:** New `getCurrentIosBuildNumber()` function to read actual iOS build number from `ios/Runner.xcodeproj/project.pbxproj`
- **Enhanced Version Display:** `version` command now shows both Android and iOS build numbers separately

### Improved

- **Version Management Accuracy:** iOS build numbers now accurately reflect the actual project state

## [1.2.3]

### Fixed

- **Silent Validation:** Removed unwanted version number output during command execution by implementing silent validation checks

### Added

- **Silent Command Execution:** New `execCommandSilent()` function for validation operations that don't need output logging

### Improved

- **User Experience:** Cleaner command output without version information appearing during validation

## [1.2.2]

### Fixed

- **Command Naming Conflicts:** Resolved yargs command conflicts that prevented version bump commands from working correctly
- **Version Bump Accuracy:** Fixed issue where major/minor/patch bumps were only incrementing Android build numbers

### Changed

- **Simplified Command Names:**
  - `version bump <type>` renamed to `bump <type>` for major/minor/patch version bumps
  - `version bump-ios` renamed to `bump-ios`
  - `version bump-android` renamed to `bump-android`
  - `version` command renamed to `version` for displaying current version

### Added

- **FVM Default Configuration:** Changed default `useFvmByDefault` setting to `true` in `init` command configuration

### Improved

- **Documentation:** Updated all documentation files (USAGE.md, VERSION_MANAGEMENT.md, README.md) with new command names and workflows

## [1.2.1]

### Added

- **Open Build Output Commands:** New commands to quickly access build artifacts:
  - `open-ipa` - Opens the IPA build output directory (`build/ios/ipa/`)
  - `open-apk` - Opens the APK build output directory (`build/app/outputs/flutter-apk/`)
  - `open-bundle` - Opens the Android Bundle output directory (`build/app/outputs/bundle/release/`)
- **Cross-Platform Support:** All open commands work seamlessly on macOS (Finder), Windows (Explorer), and Linux (default file manager)
- **Smart Validation:** Commands check if build output exists before attempting to open, with helpful error messages

### Improved

- **Documentation:** Updated USAGE.md with comprehensive open build output commands section
- **User Experience:** No need for shell aliases to access build outputs - built directly into the CLI

## [1.2.0]

### Added

- **Device Management Commands:** New comprehensive device management system for Flutter development:
  - `devices` - List all connected devices with numbered display, showing device names, platforms, IDs, and types (Physical/Emulator)
  - `run` - Run Flutter app on a specific device with support for `--device`, `--release`, `--flavor`, and FVM options
  - `run-select` - Interactive device selection with numbered prompts for easy device targeting
- **Enhanced Architecture:** Reorganized codebase with domain-based folder structure for better maintainability:
  - Commands organized by domain (build, clean, version, project, config)
  - Utilities categorized into validators, helpers, and services
  - Improved import paths and module organization

### Improved

- **Documentation:** Updated README.md with streamlined feature list and better documentation links
- **Code Quality:** Enhanced TypeScript type safety and error handling across device management features

## [1.1.1]

### Added

- **VS Code Setup Command:** Use the `setup-vscode` command to automatically create a `.vscode` folder with recommended Flutter settings—configured specifically for FVM. This command streamlines your project setup by setting the Flutter SDK path to `.fvm/flutter_sdk`, ensuring a smooth development experience for FVM users.

## [1.0.4]

### Modified

- Updated the CLI to support the latest version of Opticore.

## [1.0.3]
### Optimized
- Updated the CLI to support the latest version of Opticore.

## [1.0.2]
### Enhanced
- Improved error handling and messaging for better user experience.

## [1.0.1]
### Added
- Initial prototype with basic CLI command structure.