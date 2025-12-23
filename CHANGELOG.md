# Changelog

All notable changes to this project are documented in this file. Each release includes details about new features, improvements, bug fixes, and any breaking changes. This changelog helps users and developers track the evolution of the project and understand how different versions may impact their use of the tool.

We follow Semantic Versioning (SemVer) to indicate the nature of changes:

	•	MAJOR: Breaking changes that may affect compatibility.
	•	MINOR: New features or improvements that are backward compatible.
	•	PATCH: Bug fixes and minor improvements that are backward compatible.

Each section lists the changes in chronological order, with the most recent release at the top. We also include links to relevant discussions or issues when appropriate.

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