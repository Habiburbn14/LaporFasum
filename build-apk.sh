#!/bin/bash
# Build APK script for LaporFasum

set -e

echo "🔨 Building web assets..."
npm run build

echo "📱 Syncing with Android..."
npx cap sync android

echo "🤖 Building Debug APK..."
cd android
./gradlew assembleDebug
cd ..

APK_PATH="android/app/build/outputs/apk/debug/LaporFasum-v1.0-debug.apk"
if [ -f "$APK_PATH" ]; then
    SIZE=$(du -h "$APK_PATH" | cut -f1)
    echo "✅ APK built successfully!"
    echo "📦 Location: $APK_PATH"
    echo "📏 Size: $SIZE"
    echo ""
    echo "To install on device:"
    echo "  adb install -r $APK_PATH"
else
    echo "❌ APK not found at expected location"
    exit 1
fi