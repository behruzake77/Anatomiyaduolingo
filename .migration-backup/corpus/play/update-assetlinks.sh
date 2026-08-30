#!/usr/bin/env bash
# assetlinks.json ni yangilash: Play Console → Release → Setup → App signing
# yoki bubblewrap buyrug'idan olingan SHA-256 barmoq izini kiriting.
#
#   ./play/update-assetlinks.sh AA:BB:CC:...:FF [paket.nomi]
#
set -euo pipefail

SHA="${1:?Ishlatish: ./play/update-assetlinks.sh <SHA256> [paket]}"
PKG="${2:-com.corpus.anatomy}"
OUT="corpus/public/.well-known/assetlinks.json"

mkdir -p "$(dirname "$OUT")"
cat > "$OUT" <<EOF
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "$PKG",
      "sha256_cert_fingerprints": [
        "$SHA"
      ]
    }
  }
]
EOF

echo "✓ Yangilandi: $OUT"
echo "  Deploy qiling va https://<saytingiz>/.well-known/assetlinks.json ni tekshiring."
