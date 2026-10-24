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
#
# TEST HEALTH (ISS-24448, DES-18577 "Every repository with CI"). This repository
# has no test runner but this script, so each check below is one SPEC: `ci_step`
# from `ci/test-steps.sh` -- devops' `templates/ci/test-steps.sh`, byte for byte,
# which says how -- runs it, writes its JUnit report where the line below names,
# leaves out a step the lists hold as quarantined or slow, and reruns a failed
# step once. A failed step does not stop the build: every step runs and
# `ci_steps_end` fails it. A step's name is its spec's name in the lists and the
# ledger; each app is the step `app-<dir>`, so renaming a directory starts its
# history over.
# ci-test-reports: target/ci-test-reports/*.xml
# ci-test-lists: required
set -euo pipefail

cd "$(dirname "$0")/.."
echo "building ${CI_REPO:-$(basename "$PWD")} @ ${CI_SHA:-working tree} (${CI_EVENT:-local}, clean=${CI_CLEAN_BUILD:-?})"

ci_report() { # ci_report covered|not-run "<short phrase>"
  local line="ci-$1: $2"
  echo "$line"
  [ -z "${CI_COVERAGE_FILE:-}" ] || printf '%s\n' "$line" >>"$CI_COVERAGE_FILE"
}

# One app's whole build, run as its step: `npm ci`, `npm run check`, and
# `npm run build` unless the app waits on pulled content (above).
build_app() { # build_app <dir>
  local app=$1
  echo "== $app: node $(node --version)"
  cd "$app"
  npm ci
  npm run check
  if awaits_content .; then
    echo "$app: no content pulled, build not run"
    return 0
  fi
  npm run build
}

# Whether the app [1] stops at check because no content snapshot is committed.
awaits_content() { [ -x "$1/scripts/pull-content.sh" ] && [ ! -f "$1/content/source.json" ]; }

shopt -s nullglob
apps=()
for manifest in */package.json; do
  apps+=("$(dirname "$manifest")")
done

source ci/test-steps.sh
ci_steps_begin

ci_step test-steps-template "ci/test-steps.sh is devops' template" ci_steps_template_check

if [ ${#apps[@]} -eq 0 ]; then
  ci_report covered "assets only, no app to build"
fi

for app in ${apps[@]+"${apps[@]}"}; do
  if awaits_content "$app"; then
    ci_report not-run "$app build (no content pulled)"
    ci_step "app-$app" "$app check" build_app "$app"
  else
    ci_step "app-$app" "$app check + build" build_app "$app"
  fi
done

ci_steps_end
