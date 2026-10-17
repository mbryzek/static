#!/usr/bin/env bash
#
# Take a snapshot of the thesis from the projects repo into this site:
#
#   scripts/pull-content.sh --dir <path>    # a local dads-thesis checkout, as it is on disk
#
# There is no mode that clones mbryzek/projects: that repo encrypts every path at rest with
# git-crypt, so a clone holds ciphertext. The pull reads an unlocked checkout instead.
#
# Writes content/ (the published sections in Polish and English, the glossary, the changelog,
# source.json naming the commit, stripped.txt) and static/figures/ (each rys-NN.png, downscaled for
# the web). Commit what it writes and rebuild; rerun it when corrections land in projects.
#
# Only the published sections are copied: front and 1-9. lib (the library labels) and rev-1..rev-3
# (the examiners' reports) never leave the projects repo.
set -euo pipefail

THESIS_PATH=dads-thesis
SECTIONS=(front 1 2 3 4 5 6 7 8 9)
# Figures are scanned at print resolution; the widest a reading column ever shows them is well under
# this, and twice the column keeps them sharp on a high-density screen.
FIGURE_MAX_PX=1600

site=$(cd "$(dirname "$0")/.." && pwd)

usage() { echo "usage: $0 --dir <dads-thesis path>" >&2; exit 2; }
[ $# -eq 2 ] && [ "$1" = "--dir" ] || usage

src=$(cd "$2" && pwd)
# A locked checkout of the projects repo holds git-crypt ciphertext, which would publish as text.
if [ -f "$src/source/pl/sections/front.md" ] && head -c 10 "$src/source/pl/sections/front.md" | LC_ALL=C grep -aq GITCRYPT; then
  echo "$src is git-crypt encrypted: run git-crypt unlock in that checkout first" >&2
  exit 1
fi
commit=$(git -C "$src" rev-parse HEAD 2>/dev/null || echo "")
# Dirty means a published file differs from the commit; the rest of the tree is not copied.
published=(source/pl/sections en glossary/glossary.csv source/figures)
if [ -n "$commit" ] && [ -n "$(cd "$src" && git status --porcelain -- "${published[@]}" 2>/dev/null)" ]; then
  commit="$commit-dirty"
fi
# The footer names the repository, never a path on someone's disk: a checkout of the projects
# repo reads as mbryzek/projects even when the commit is not pushed yet.
remote=$(git -C "$src" remote get-url origin 2>/dev/null || echo "")
repo=$(printf '%s' "$remote" | sed -nE 's#.*github\.com[:/]([^/]+/[^/.]+)(\.git)?$#\1#p')
[ -n "$repo" ] || repo="local"

need() { [ -f "$1" ] || { echo "missing: $1" >&2; exit 1; }; }

rm -rf "$site/content/pl" "$site/content/en"
mkdir -p "$site/content/pl" "$site/content/en" "$site/static/figures"
for s in "${SECTIONS[@]}"; do
  need "$src/source/pl/sections/$s.md"
  need "$src/en/$s.md"
  cp "$src/source/pl/sections/$s.md" "$site/content/pl/$s.md"
  cp "$src/en/$s.md" "$site/content/en/$s.md"
done
need "$src/glossary/glossary.csv"
cp "$src/glossary/glossary.csv" "$site/content/glossary.csv"
# The credits for corrections readers sent, written by dads-thesis/checks/intake.py; absent until
# the first one lands.
rm -f "$site/content/CHANGELOG.md"
[ -f "$src/CHANGELOG.md" ] && cp "$src/CHANGELOG.md" "$site/content/CHANGELOG.md"

downscale() { # downscale <in> <out>: at most FIGURE_MAX_PX on the longer side, never enlarged
  if command -v sips >/dev/null 2>&1; then
    sips --resampleHeightWidthMax "$FIGURE_MAX_PX" "$1" --out "$2" >/dev/null
  elif command -v magick >/dev/null 2>&1; then
    magick "$1" -resize "${FIGURE_MAX_PX}x${FIGURE_MAX_PX}>" -strip "$2"
  else
    echo "neither sips (macOS) nor ImageMagick's magick is installed to downscale figures" >&2
    exit 1
  fi
}

rm -f "$site/static/figures/"rys-*.png
shopt -s nullglob
figures=("$src"/source/figures/rys-*.png)
for f in "${figures[@]}"; do
  out="$site/static/figures/$(basename "$f" | tr '[:upper:]' '[:lower:]')"
  downscale "$f" "$out"
  # sips only ever shrinks with --resampleHeightWidthMax when the image is larger; copy otherwise.
  [ -s "$out" ] || cp "$f" "$out"
done

cat > "$site/content/source.json" <<JSON
{
  "repo": "$repo",
  "path": "$THESIS_PATH",
  "commit": "$commit",
  "pulled_at": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
JSON

node "$site/scripts/stripped-report.ts" "$site/content" > "$site/content/stripped.txt"

echo "pulled $repo ${commit:-(not a git checkout)}: ${#SECTIONS[@]} sections per language, ${#figures[@]} figures"
echo "read content/stripped.txt: every bracketed span removed as a transcription description"
