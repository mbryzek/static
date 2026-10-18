#!/usr/bin/env bash
#
# The fleet's build for `static` (ISS-20817), from devops templates/ci/build.sh.
# Landing this file is the enrolment: the fleet verify job runs it at every pull
# request's head and posts the `ci` status the merge lane reads (devops docs/ci.md).
#
# `static` is two kinds of thing side by side:
#
#   - ASSET DIRECTORIES (`michaelbryzek/`, `lakeviewsummit-ui/`): images served
#     as they are. Nothing builds them, so a tree holding only these is green.
#   - APP DIRECTORIES: any top-level directory with a `package.json` (none at
#     present; janusz.bryzek.com moved to mbryzek/janusz, ISS-21167). Each is
#     built on its own, in its own directory,
#     with the shape every SvelteKit repo in the fleet uses: `npm ci`, then
#     `npm run check` (svelte-check, eslint, the unit suite), then
#     `npm run build`. No Playwright: a browser suite cannot produce a verdict on
#     a runner, and a red for an infrastructure reason is worse than no suite.
#
# AN APP WHOSE CONTENT IS PULLED IN builds only once a pull is committed. An app
# carrying `scripts/pull-content.sh` publishes a snapshot of text kept
# in another repository, and its `npm run build` fails on purpose until
# `content/` holds one, so that an empty site cannot be published. Before that
# snapshot is committed, `check` is the whole verdict and the build is reported
# as not run. This script never pulls the fixture itself: it also runs in a
# developer's working tree before a push, and a fixture pull there is a
# `content/` the app's README says must not be committed.
#
# Formatting is advisory and is not run here (ISS-19427): the repository has no
# root `package.json`, so `dev fmt report` has no formatter to ask at the root,
# and `dev agent pr create` formats what a branch changed before it publishes.
#
# The first build was confirmed by hand before the lane depended on it:
#
#   dev ci verify --repo mbryzek/static --sha <head sha> --pr <n> --no-post
#
# ci-needs:
set -euo pipefail

cd "$(dirname "$0")/.."
echo "building ${CI_REPO:-$(basename "$PWD")} @ ${CI_SHA:-working tree} (${CI_EVENT:-local}, clean=${CI_CLEAN_BUILD:-?})"

ci_report() { # ci_report covered|not-run "<short phrase>"
  local line="ci-$1: $2"
  echo "$line"
  [ -z "${CI_COVERAGE_FILE:-}" ] || printf '%s\n' "$line" >>"$CI_COVERAGE_FILE"
}

build_app() { # build_app <dir>
  local app=$1
  echo "== $app: node $(node --version)"
  (
    cd "$app"
    npm ci
    npm run check
  )
  if [ -x "$app/scripts/pull-content.sh" ] && [ ! -f "$app/content/source.json" ]; then
    ci_report covered "$app check"
    ci_report not-run "$app build (no content pulled)"
    return 0
  fi
  (cd "$app" && npm run build)
  ci_report covered "$app check + build"
}

shopt -s nullglob
apps=()
for manifest in */package.json; do
  apps+=("$(dirname "$manifest")")
done

if [ ${#apps[@]} -eq 0 ]; then
  ci_report covered "assets only, no app to build"
  exit 0
fi

for app in "${apps[@]}"; do
  build_app "$app"
done
