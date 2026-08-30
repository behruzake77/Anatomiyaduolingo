#!/usr/bin/env bash
# CORPUS APK qurish — to'liq oflayn (WebView qobiq, kitoblarsiz).
#
# Talab qilinadi:
#   1) java (masalan: pip install jdk4py)
#   2) vositalar papkasi $TOOLS da: android.jar, ecj jar, d8.jar,
#      apksigner.jar, apktool jar (barchasi npm'dan olinadi, pastga qarang)
#   3) openssl (keystore uchun), zip, imagemagick (rasm siqish), python3
#
# Vositlarni yig'ish (barchasi bloklangan tarmoqlarsiz ham ishlaydi):
#   pip install jdk4py
#   npm pack apktool-jar @drxiaozhi/minapk
#   tar xzf apktool-jar-*.tgz  → package/bin/apktool_*.jar
#   tar xzf drxiaozhi-minapk-*.tgz → package/tools/{android.jar,ecj*,d8.jar,apksigner.jar}
#
# Ishga tushirish (corpus/ ichidan):
#   TOOLS=/path/tools JAVA=/path/java ./play/android/build-apk.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"      # corpus/
ANDROID="$ROOT/play/android"
JAVA="${JAVA:-java}"
TOOLS="${TOOLS:?TOOLS=/path/to/tools kiriting}"
KEYSTORE="${KEYSTORE:-$ANDROID/corpus-release.p12}"
KS_PASS="${KS_PASS:-corpus-anatomy-2026}"
OUT="$ANDROID/out"

echo "1/6 — Next.js statik eksport"
cd "$ROOT"
BUILD_EXPORT=1 npm run build

echo "2/6 — assets (kitoblarsiz) + rasm siqish"
mkdir -p "$OUT/apkproj/assets/www"
cp -r out/. "$OUT/apkproj/assets/www/"
rm -rf "$OUT/apkproj/assets/www/books" "$OUT/apkproj/assets/www/.well-known"
find "$OUT/apkproj/assets/www/img" -name "*.jpg" -print0 \
  | xargs -0 -P 4 -n 30 mogrify -quality 58

echo "3/6 — Java → dex"
cp "$ANDROID/apktool.yml" "$ANDROID/AndroidManifest.xml" "$OUT/apkproj/"
cp -r "$ANDROID/res" "$OUT/apkproj/"
mkdir -p "$OUT/apkproj/smali" "$OUT/build/classes" "$OUT/build/dex"
"$JAVA" -jar "$TOOLS/ecj"*.jar -nowarn -proc:none -source 8 -target 8 \
  -classpath "$TOOLS/android.jar" -d "$OUT/build/classes" \
  "$ANDROID/src/com/corpus/anatomy/MainActivity.java"
"$JAVA" -cp "$TOOLS/d8.jar" com.android.tools.r8.D8 --release \
  --lib "$TOOLS/android.jar" --min-api 24 --output "$OUT/build/dex" \
  "$(find "$OUT/build/classes" -name '*.class')"

echo "4/6 — apktool (resurslar + paket)"
"$JAVA" -jar "$TOOLS/apktool"*.jar b "$OUT/apkproj" -f -o "$OUT/build/CORPUS-unsigned.apk"
(cd "$OUT/build/dex" && zip -X ../CORPUS-unsigned.apk classes.dex)

echo "5/6 — keystore + imzolash"
if [ ! -f "$KEYSTORE" ]; then
  openssl req -x509 -newkey rsa:2048 -keyout /tmp/corpus-key.pem \
    -out /tmp/corpus-cert.pem -days 9131 -nodes \
    -subj "/CN=CORPUS/O=Corpus Anatomy/C=UZ"
  openssl pkcs12 -export -in /tmp/corpus-cert.pem -inkey /tmp/corpus-key.pem \
    -out "$KEYSTORE" -name corpus -passout "pass:$KS_PASS"
fi
"$JAVA" -jar "$TOOLS/apksigner.jar" sign --ks "$KEYSTORE" --ks-key-alias corpus \
  --ks-pass "pass:$KS_PASS" --key-pass "pass:$KS_PASS" \
  --out "$OUT/build/CORPUS-v1.0.apk" "$OUT/build/CORPUS-unsigned.apk"

echo "6/6 — tekshirish"
"$JAVA" -jar "$TOOLS/apksigner.jar" verify --print-certs "$OUT/build/CORPUS-v1.0.apk"
echo "✓ Tayyor: $OUT/build/CORPUS-v1.0.apk"

# Yangi versiya: AndroidManifest.xml va apktool.yml da versionCode/versionName ni
# oshiring (masalan 2 / "1.1") va qayta ishga tushiring — KEYSTORE NI YO'QOTMANG!
