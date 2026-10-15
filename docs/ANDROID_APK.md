# Android APK: build and release guide

The APK is a full-screen WebView shell. It opens your deployed web app, so the site must be online. It does not contain the server, the database, or the AI keys. Those stay on your server.

## 1. Choose the site URL

The APK opens the URL in `APP_URL`. Set it in one of three places, in this order of priority:

1. Gradle property at build time: `-PappUrl=https://your-domain.example`
2. Environment variable: `APP_URL=https://your-domain.example`
3. The default in `android/gradle.properties` (`appUrl=...`)

The URL must start with `https://`. The build fails otherwise.

## 2. Prerequisites

| Tool | Version | Notes |
| --- | --- | --- |
| JDK | 17 | Gradle 8.2 and AGP 8.2 need Java 17 |
| Android SDK | platform `android-34`, build-tools `34.0.0` | Install with `sdkmanager` |
| Memory | 2 GB or more free | Gradle runs with a 1 GB heap by default |

Install the SDK pieces once:

```bash
sdkmanager --sdk_root="$ANDROID_HOME" "platform-tools" "platforms;android-34" "build-tools;34.0.0"
sdkmanager --licenses
```

Set the environment variables (examples for Linux or macOS):

```bash
export JAVA_HOME=/path/to/jdk-17
export ANDROID_HOME=/path/to/android-sdk
```

## 3. Create a release signing key (once)

Release APKs must be signed. Keep the keystore and its passwords safe. If you lose them, existing installs cannot be updated.

```bash
keytool -genkeypair -v \
  -keystore ~/keys/gta-community-release.jks -storetype PKCS12 \
  -alias gta-community -keyalg RSA -keysize 2048 -validity 10000
```

Then create `android/keystore.properties` (this file is git-ignored):

```properties
storeFile=/home/you/keys/gta-community-release.jks
storePassword=YOUR_STORE_PASSWORD
keyAlias=gta-community
keyPassword=YOUR_KEY_PASSWORD
```

For CI, use environment variables instead: `GTAC_KEYSTORE_FILE`, `GTAC_KEYSTORE_PASSWORD`, `GTAC_KEY_ALIAS`, `GTAC_KEY_PASSWORD`.

## 4. Build the APK

Linux or macOS:

```bash
cd android
./gradlew assembleRelease -PappUrl=https://your-domain.example
```

Windows:

```bat
cd android
gradlew.bat assembleRelease -PappUrl=https://your-domain.example
```

Output: `android/app/build/outputs/apk/release/app-release.apk`

Check the result:

```bash
apksigner verify --verbose app/build/outputs/apk/release/app-release.apk
aapt dump badging app/build/outputs/apk/release/app-release.apk | head -3
```

Add `--no-daemon` on machines with little memory.

Debug build (for testing, signed with the debug key):

```bash
./gradlew assembleDebug -PappUrl=https://your-domain.example
```

The debug build has the `.debug` package suffix, so it installs next to the release build.

## 5. Install on a phone

1. Copy `app-release.apk` to the phone, or download it from the GitHub Release page.
2. Open the file. Android asks you to allow installs from this source. Allow it for the browser or file manager you used.
3. Tap **Install**, then open **GTA Online Community**.

## 6. Publish on GitHub

1. Bump `versionCode` (must increase on every release) and `versionName` in `android/app/build.gradle`.
2. Build the APK as described above.
3. Create checksums so people can verify the download:

   ```bash
   sha256sum app-release.apk > SHA256SUMS.txt
   ```

4. Go to your repository, open **Releases**, click **Draft a new release**, create a tag such as `v1.0.0`, and upload `app-release.apk` and `SHA256SUMS.txt` as assets.
5. Write the release notes. Mention the site URL the APK opens.

**Do not commit the APK to the repository.** `.gitignore` already excludes `*.apk`. Use Releases for binaries.

## 7. How the shell behaves

- Pages on your site's host open inside the app.
- Links to other websites, `mailto:` and `tel:` open in the browser or the matching app.
- If the site cannot be reached, the app shows a bundled offline page with a **Try again** button.
- The back button goes back in the web history first, then leaves the app.
- Cookies and local storage are enabled, so login and chat work the same as in the browser.
- Mixed content (HTTP inside HTTPS) is blocked, and cleartext traffic is off.
- Rotation does not reload the page (`configChanges` in the manifest).

## 8. Troubleshooting

| Symptom | Cause and fix |
| --- | --- |
| `appUrl must start with https://` | Use an `https://` URL in `-PappUrl`, `APP_URL`, or `gradle.properties`. |
| Build stops with "daemon disappeared" | The machine ran out of memory. Close other programs, or lower `org.gradle.jvmargs` in `gradle.properties`. |
| `SDK location not found` | Set `ANDROID_HOME`, or add `sdk.dir=/path/to/android-sdk` to `android/local.properties` (git-ignored). |
| Installed APK shows the offline page | The site is down or the URL is wrong. Open the URL in a phone browser to test it. |
| Login does not stick | Make sure the server uses HTTPS and the cookie settings match your domain. |
| "App not installed" on update | The new APK is signed with a different key, or its `versionCode` is not higher. Use the same keystore and increase `versionCode`. |

## 9. What this is not

This is a WebView wrapper, not a store-ready native app. It needs an internet connection and a running server. Google Play has its own review rules for WebView apps. Test the APK on a few devices before you publish it widely.
