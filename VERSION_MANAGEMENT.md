# OptiKit CLI - Smart Version Management

## Overview

OptiKit provides intelligent version management that handles the complexities of Flutter's dual build number system (iOS and Android) automatically.

---

## 🎯 The Problem

Flutter apps have **two separate build numbers**:
- **Android**: Single build number in `pubspec.yaml` (e.g., `1.0.0+5`)
- **iOS**: Separate build number in Xcode project

**Common scenarios:**
1. **New version release** → Increment version, reset iOS build to 1, increment Android build
2. **TestFlight upload** → Keep version same, only increment iOS build
3. **Google Play upload** → Keep version same, only increment Android build

OptiKit handles all these scenarios automatically!

---

## 📱 Commands

### 1. Show Current Version

```bash
optikit version
```

**Output:**
```
📱 Current Version Information

Version: 1.2.3+45
  Major: 1
  Minor: 2
  Patch: 3
  Build: 45
```

---

### 2. Bump Version (Semantic Versioning)

#### Bump Patch (1.2.3 → 1.2.4)
```bash
optikit bump patch
```

**What it does:**
- Increments patch number: `1.2.3` → `1.2.4`
- Increments Android build: `45` → `46`
- **Resets iOS build to 1** (new version = fresh start)

**Use when:**
- Bug fixes
- Minor updates
- No new features

#### Bump Minor (1.2.4 → 1.3.0)
```bash
optikit bump minor
```

**What it does:**
- Increments minor number: `1.2` → `1.3`
- Resets patch to 0: `1.2.4` → `1.3.0`
- Increments Android build: `46` → `47`
- **Resets iOS build to 1**

**Use when:**
- New features added
- Backward-compatible changes

#### Bump Major (1.3.0 → 2.0.0)
```bash
optikit bump major
```

**What it does:**
- Increments major number: `1` → `2`
- Resets minor and patch to 0: `1.3.0` → `2.0.0`
- Increments Android build: `47` → `48`
- **Resets iOS build to 1**

**Use when:**
- Breaking changes
- Major redesign
- Complete rewrite

---

### 3. Bump iOS Build Only (TestFlight)

```bash
optikit bump-ios
```

**What it does:**
- **Only** increments iOS build number
- Keeps version unchanged
- Keeps Android build unchanged

**Example:**
```
Before:
  Version: 1.2.3
  Android: 45
  iOS: 1

After:
  Version: 1.2.3 (unchanged)
  Android: 45 (unchanged)
  iOS: 2 ✅
```

**Use when:**
- Uploading to TestFlight
- iOS-only fixes
- Testing iOS-specific features

---

### 4. Bump Android Build Only

```bash
optikit bump-android
```

**What it does:**
- **Only** increments Android build number
- Keeps version unchanged
- Keeps iOS build unchanged

**Example:**
```
Before:
  Version: 1.2.3+45
  iOS: 1

After:
  Version: 1.2.3+46 ✅
  iOS: 1 (unchanged)
```

**Use when:**
- Uploading to Google Play
- Android-only fixes
- Testing Android-specific features

---

## 📊 Version Strategy

### Scenario 1: New App Version Release

**Goal:** Release version 1.0.3 (from 1.0.2)

```bash
# Current: 1.0.2+5
optikit bump patch

# Result:
# Version: 1.0.3+6
# iOS build: 1 (reset)
# Android build: 6 (incremented)
```

**Why iOS resets to 1?**
- New version = new submission to App Store
- Build numbers restart for each version in App Store Connect
- This matches Apple's expectation

---

### Scenario 2: Multiple TestFlight Builds

**Goal:** Upload multiple iOS test builds without changing version

```bash
# Current: 1.0.3+6 (iOS build: 1)

# First TestFlight upload
optikit bump-ios
# Version: 1.0.3+6, iOS: 2

# Found a bug, fix it, upload again
optikit bump-ios
# Version: 1.0.3+6, iOS: 3

# Another fix
optikit bump-ios
# Version: 1.0.3+6, iOS: 4
```

**Perfect for:**
- Internal testing
- Beta testing
- Multiple TestFlight iterations

---

### Scenario 3: Android Hotfix

**Goal:** Fix Android-only bug and upload to Google Play

```bash
# Current: 1.0.3+6 (iOS: 4)

# Increment Android build only
optikit bump-android
# Version: 1.0.3+7, iOS: 4 (unchanged)
```

---

### Scenario 4: Complete Release Cycle

```bash
# 1. Start: 1.0.2+10 (iOS: 5)

# 2. New feature development
optikit bump minor
# → 1.1.0+11 (iOS: 1, Android: 11)

# 3. TestFlight testing (3 iterations)
optikit bump-ios  # iOS: 2
optikit bump-ios  # iOS: 3
optikit bump-ios  # iOS: 4

# 4. Android beta testing
optikit bump-android  # Android: 12

# 5. Fix found during testing
optikit bump patch
# → 1.1.1+13 (iOS: 1, Android: 13)

# 6. Final TestFlight
optikit bump-ios  # iOS: 2

# 7. Release to stores!
# iOS: 1.1.1 (build 2)
# Android: 1.1.1 (build 13)
```

---

## 🎨 Visual Examples

### Example 1: Patch Bump

```
BEFORE:                    AFTER:
┌─────────────┐           ┌─────────────┐
│ Version     │           │ Version     │
│   1.2.3     │   ───>    │   1.2.4     │  ✅ Patch +1
│             │           │             │
│ Android: 45 │   ───>    │ Android: 46 │  ✅ Build +1
│ iOS: 3      │   ───>    │ iOS: 1      │  ✅ Reset to 1
└─────────────┘           └─────────────┘

Command: optikit bump patch
```

### Example 2: iOS-Only Bump

```
BEFORE:                    AFTER:
┌─────────────┐           ┌─────────────┐
│ Version     │           │ Version     │
│   1.2.4     │   ───>    │   1.2.4     │  ⏸️  Unchanged
│             │           │             │
│ Android: 46 │   ───>    │ Android: 46 │  ⏸️  Unchanged
│ iOS: 1      │   ───>    │ iOS: 2      │  ✅ Build +1
└─────────────┘           └─────────────┘

Command: optikit bump-ios
```

---

## 🔍 Technical Details

### File Updates

#### Version Bump Commands Update:
1. **pubspec.yaml**: `version: X.Y.Z+B`
2. **iOS project.pbxproj**: `MARKETING_VERSION` and `CURRENT_PROJECT_VERSION`
3. **iOS Info.plist**: `CFBundleShortVersionString` and `CFBundleVersion`

#### Automatic Backups:
All files are backed up before modification (see [SAFETY_FEATURES.md](SAFETY_FEATURES.md))

### Version Format

**pubspec.yaml:**
```yaml
version: 1.2.3+45
         │ │ │  │
         │ │ │  └─ Build number (Android)
         │ │ └──── Patch
         │ └────── Minor
         └──────── Major
```

**iOS (separate):**
- **CFBundleShortVersionString**: `1.2.3` (display version)
- **CFBundleVersion**: `1`, `2`, `3`... (build number)

---

## 📋 Command Reference

| Command | Version | Android Build | iOS Build | Use Case |
|---------|---------|---------------|-----------|----------|
| `version bump patch` | +0.0.1 | +1 | Reset to 1 | Bug fixes |
| `version bump minor` | +0.1.0 | +1 | Reset to 1 | New features |
| `version bump major` | +1.0.0 | +1 | Reset to 1 | Breaking changes |
| `version bump-ios` | No change | No change | +1 | TestFlight builds |
| `version bump-android` | No change | +1 | No change | Google Play builds |

---

## 🎯 Best Practices

### 1. Always Use Semantic Versioning
```bash
# Bug fix
optikit bump patch

# New feature
optikit bump minor

# Breaking change
optikit bump major
```

### 2. TestFlight Workflow
```bash
# Create new version
optikit bump minor

# Multiple TestFlight uploads
optikit bump-ios  # Upload 1
optikit bump-ios  # Upload 2
optikit bump-ios  # Upload 3

# When satisfied, release to App Store
# (No additional command needed)
```

### 3. Hotfix Workflow
```bash
# iOS hotfix
optikit bump patch
optikit flutter-build-ipa

# Android hotfix
optikit bump patch
optikit flutter-build-bundle
```

### 4. Check Before Bumping
```bash
# Always check current version first
optikit version

# Then bump
optikit bump patch
```

---

## ⚠️ Important Notes

### iOS Build Number Strategy

**Why reset to 1?**
- App Store Connect requires unique build numbers **per version**
- Build 1 of version 1.0.0 ≠ Build 1 of version 1.0.1
- This matches Apple's system and prevents confusion

**Example:**
```
App Store Connect:
├── Version 1.0.0
│   ├── Build 1
│   ├── Build 2
│   └── Build 3 ✅ Released
└── Version 1.0.1
    ├── Build 1 ← Starts fresh
    ├── Build 2
    └── Build 3 ✅ Released
```

### Android Build Number Strategy

**Why always increment?**
- Google Play requires strictly increasing build numbers
- Build 45 < Build 46 < Build 47
- Never reset, always increment

---

## 🚀 Quick Reference

```bash
# Show current version
optikit version

# Release new version
optikit bump patch    # 1.0.0 → 1.0.1
optikit bump minor    # 1.0.1 → 1.1.0
optikit bump major    # 1.1.0 → 2.0.0

# TestFlight only
optikit bump-ios

# Google Play only
optikit bump-android
```

---

## 📖 Related Documentation

- [ENHANCEMENTS.md](ENHANCEMENTS.md) - Bug fixes
- [SAFETY_FEATURES.md](SAFETY_FEATURES.md) - Backups & validation
- [CODE_QUALITY.md](CODE_QUALITY.md) - Architecture
- [FEATURE_ENHANCEMENTS.md](FEATURE_ENHANCEMENTS.md) - New features

---

**Version:** 1.1.1+smart-versioning
**Last Updated:** December 23, 2025
**Status:** ✅ Production Ready
