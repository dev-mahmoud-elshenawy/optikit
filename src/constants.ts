/**
 * Application-wide constants
 */

// Build configurations
export const BUILD_CONFIGS = {
  APK: {
    outputPath: "build/app/outputs/symbols",
    flags: ["--release", "--obfuscate"],
  },
  BUNDLE: {
    outputPath: "build/app/outputs/symbols",
    flags: ["--release", "--obfuscate"],
  },
  IOS: {
    flags: ["--release"],
  },
  IPA: {
    flags: ["--release"],
  },
} as const;

// Project structure
export const PROJECT_PATHS = {
  PUBSPEC: "pubspec.yaml",
  PUBSPEC_LOCK: "pubspec.lock",
  IOS_DIR: "ios",
  ANDROID_DIR: "android",
  LIB_DIR: "lib",
  MODULE_DIR: "lib/module",
  IOS_RUNNER_PROJ: "ios/Runner.xcodeproj",
  IOS_RUNNER_WORKSPACE: "ios/Runner.xcworkspace",
  IOS_PROJECT_PBXPROJ: "ios/Runner.xcodeproj/project.pbxproj",
  IOS_INFO_PLIST: "ios/Runner/Info.plist",
  IOS_PODFILE_LOCK: "ios/Podfile.lock",
  ANDROID_BUILD_GRADLE: "android/build.gradle",
  ANDROID_BUILD_GRADLE_KTS: "android/build.gradle.kts",
  FVM_FLUTTER_SDK: ".fvm/flutter_sdk",
  VSCODE_DIR: ".vscode",
  VSCODE_SETTINGS: ".vscode/settings.json",
} as const;

// Backup configuration
export const BACKUP_CONFIG = {
  DIR_NAME: ".optikit-backup",
  RETENTION_COUNT: 5,
} as const;

// Module generation
export const MODULE_STRUCTURE = {
  DIRECTORIES: ["bloc", "event", "state", "screen", "import", "factory"],
  NAME_PATTERN: /^[a-z0-9_]+$/,
} as const;

// Flutter commands
export const FLUTTER_COMMANDS = {
  CLEAN: "flutter clean",
  PUB_GET: "flutter pub get",
  BUILD_APK: "flutter build apk",
  BUILD_BUNDLE: "flutter build appbundle",
  BUILD_IOS: "flutter build ios",
  BUILD_IPA: "flutter build ipa",
  PRECACHE_IOS: "flutter precache --ios",
  VERSION: "flutter --version",
} as const;

// FVM commands
export const FVM_COMMANDS = {
  CLEAN: "fvm flutter clean",
  PUB_GET: "fvm flutter pub get",
  BUILD_APK: "fvm flutter build apk",
  BUILD_BUNDLE: "fvm flutter build appbundle",
  BUILD_IOS: "fvm flutter build ios",
  BUILD_IPA: "fvm flutter build ipa",
  PRECACHE_IOS: "fvm flutter precache --ios",
  VERSION: "fvm --version",
} as const;

// iOS commands
export const IOS_COMMANDS = {
  POD_DEINTEGRATE: "pod deintegrate",
  POD_INSTALL: "pod install",
  POD_UPDATE: "pod update",
  POD_REPO_UPDATE: "pod repo update",
  POD_CACHE_CLEAN: "pod cache clean --all",
} as const;

// IDE commands
export const IDE_COMMANDS = {
  XCODE: "open ios/Runner.xcworkspace",
  ANDROID_STUDIO: {
    DARWIN: "open -a 'Android Studio' android",
    WIN32: "start android",
    LINUX: "xdg-open android",
  },
} as const;

// VSCode settings template
export const VSCODE_SETTINGS_TEMPLATE = {
  "dart.flutterSdkPath": ".fvm/flutter_sdk",
  "editor.formatOnSave": true,
  "dart.previewFlutterUiGuides": true,
  "files.exclude": {
    "**/.git": true,
    "**/.DS_Store": true,
    "**/node_modules": true,
    "**/build": true,
  },
} as const;

// Retry configuration
export const RETRY_CONFIG = {
  DEFAULT_ATTEMPTS: 3,
  DEFAULT_DELAY_MS: 10000,
  IOS_TIMEOUT_MS: 600000,
} as const;

// Help URLs
export const HELP_URLS = {
  FLUTTER_INSTALL: "https://flutter.dev/docs/get-started/install",
  FVM_INSTALL: "https://fvm.app/docs/getting_started/installation",
} as const;

// Error messages
export const ERROR_MESSAGES = {
  NOT_FLUTTER_PROJECT: "Not a Flutter project: pubspec.yaml not found.",
  NO_FLUTTER_REFERENCE: "Not a Flutter project: pubspec.yaml does not reference Flutter SDK.",
  FVM_NOT_FOUND: "FVM Flutter SDK not found at .fvm/flutter_sdk",
  FLUTTER_NOT_FOUND: "Flutter SDK not found.",
  IOS_PROJECT_NOT_FOUND: "iOS project directory not found.",
  ANDROID_PROJECT_NOT_FOUND: "Android project directory not found.",
  NO_XCODE_PROJECT: "No Xcode project or workspace found in ios/ directory.",
  NO_BUILD_GRADLE: "No build.gradle found in android/ directory.",
  MODULE_NAME_EMPTY: "Module name cannot be empty.",
  MODULE_NAME_INVALID: "Module name must contain only lowercase letters, numbers, and underscores.",
} as const;

// Info messages
export const INFO_MESSAGES = {
  RUN_FROM_PROJECT_ROOT: "Please run this command from the root of a Flutter project.",
  ADD_IOS_SUPPORT: "Run 'flutter create .' to add iOS support.",
  ADD_ANDROID_SUPPORT: "Run 'flutter create .' to add Android support.",
  INSTALL_FVM_OR_DISABLE: "Run 'fvm install' or use --disable-fvm flag.",
} as const;
