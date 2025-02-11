# Usage Guide for OptiKit CLI

The **OptiKit CLI Tool** provides several commands to help streamline your development workflow. This guide explains how to use the tool, including all available commands and their respective options.

Each command is designed to simplify tasks like building Flutter projects, generating modules, and managing other aspects of your workflow. Below, you'll find detailed explanations and examples for each command supported by **OptiKit CLI**.

After installing OptiKit, you can use it directly from the command line.

---

## Command Usage

### 1. Generate a New Module
To generate a new module, run:

```bash
optikit generate module <module_name>
```

Replace `<module_name>` with the desired name for your module.

---

### 2. Clean Flutter Project
- By default, the clean command will use FVM for Flutter commands:

```bash
optikit clean-flutter
```

- To run the clean command without FVM, use the `--disable-fvm` flag:

```bash
optikit clean-flutter --disable-fvm
```

---

### 3. Clean the iOS Project
- By default, the clean command will not clean CocoaPods cache:

```bash
optikit clean-ios
```

- To clean with CocoaPods cache, use the `--clean-cache` flag:

```bash
optikit clean-ios --clean-cache
```

- To update repositories during cleaning, use the `--repo-update` flag:

```bash
optikit clean-ios --repo-update
```

---

### 4. Build Flutter APK for Release
- By default, the build command will use FVM for Flutter commands:

```bash
optikit flutter-build-apk
```

- To run the build command without FVM, use the `--disable-fvm` flag:

```bash
optikit flutter-build-apk --disable-fvm
```

---

### 5. Build Flutter Bundle for Release
- By default, the build command will use FVM for Flutter commands:

```bash
optikit flutter-build-bundle
```

- To run the build command without FVM, use the `--disable-fvm` flag:

```bash
optikit flutter-build-bundle --disable-fvm
```

---

### 6. Build Flutter iOS App for Release
- By default, the build command will use FVM for Flutter commands:

```bash
optikit flutter-build-ios
```

- To run the build command without FVM, use the `--disable-fvm` flag:

```bash
optikit flutter-build-ios --disable-fvm
```

---

### 7. Create a Release IPA for Flutter App
- By default, the build command will use FVM for Flutter commands:

```bash
optikit flutter-build-ipa
```

- To run the build command without FVM, use the `--disable-fvm` flag:

```bash
optikit flutter-build-ipa --disable-fvm
```

---

### 8. Update App Version and Build Numbers
- To set version and build numbers for Android and iOS:

```bash
optikit flutter-update-version --app-version <version> --android-build <android-build-number> --ios-build <ios-build-number>
```

Replace `<version>`, `<android-build-number>`, and `<ios-build-number>` with your desired values.

---

### 9. Open Android Project in Android Studio
- Open the Android module of your Flutter project in Android Studio:

```bash
optikit open-android
```

---

### 10. Open iOS Project in Xcode
- Open the iOS module of your Flutter project in Xcode:

```bash
optikit open-ios
```

---

### 11. VS Code Setup Command
- Automatically create a `.vscode` folder with a `settings.json` file preconfigured for Flutter projects using FVM. This command streamlines your project setup by setting the Flutter SDK path to `.fvm/flutter_sdk`.

```bash
optikit setup-vscode
```

---


## Verification

After running any command, you can verify its success by observing the output or using the `optikit --version` command to confirm the CLI's version.

---

Enjoy using **OptiKit CLI** to enhance your development workflow!
