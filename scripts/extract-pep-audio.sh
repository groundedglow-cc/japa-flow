#!/usr/bin/env bash
# Extract a PEP offline package and copy .pepm audio to .mp3, .pepp images to .png.
#
# Usage:
# ./scripts/extract-pep-audio.sh ~/Downloads/book1-unit1.pep audio/lesson1

set -euo pipefail

PEP="${1:?Usage: $0 <input.pep> <output-dir>}"
OUT="${2:?Usage: $0 <input.pep> <output-dir>}"

if [ ! -f "$PEP" ]; then
  echo "Not found: $PEP" >&2
  exit 1
fi

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

echo "==> Extracting $PEP"
unzip -q "$PEP" -d "$TMP"

mkdir -p "$OUT"

count_mp3=0
count_png=0
echo "==> Converting files"
while IFS= read -r -d '' f; do
  rel="${f#"$TMP"/}"
  case "$f" in
    *.pepm)
      out="$OUT/${rel%.pepm}.mp3"
      mkdir -p "$(dirname "$out")"
      cp "$f" "$out"
      echo "  [audio] $rel -> ${out#"$OUT"/}"
      count_mp3=$((count_mp3 + 1))
      ;;
    *.pepp)
      out="$OUT/${rel%.pepp}.png"
      mkdir -p "$(dirname "$out")"
      cp "$f" "$out"
      echo "  [image] $rel -> ${out#"$OUT"/}"
      count_png=$((count_png + 1))
      ;;
  esac
done < <(find "$TMP" \( -name "*.pepm" -o -name "*.pepp" \) -type f -print0)

echo
echo "==> Done: $count_mp3 audio files, $count_png images"
echo "==> Output: $OUT"
