#!/usr/bin/env node
"use strict";

/**
 * sync-opencode.js
 *
 * Mirrors the package's consumer-side `update()` behavior for the source
 * repo's development environment:
 *
 *   Mode 1 (replace): src/.opencode/ → root .opencode/ and
 *                      src/opencode.json → root/opencode.json. Always
 *                      overwrites; stale files in .opencode/ are removed.
 *   Mode 2 (create-if-missing): for every other file in src/, copy to root
 *                      if the destination doesn't exist. Files already at
 *                      root are left untouched — once present, they're
 *                      consumer-owned.
 *
 * `--verify-only` and `--verify` exit non-zero when either mode has drift.
 */

const fs = require("fs");
const path = require("path");
const { ROOT_ONLY, collectRelativePaths, copyMissing, deploy } = require("../package/deploy-roundhouse");

const repoRoot = path.resolve(__dirname, "..");
const srcDir = path.join(repoRoot, "src", ".opencode");
const destDir = path.join(repoRoot, ".opencode");
const srcOpenCodeJson = path.join(repoRoot, "src", "opencode.json");
const destOpenCodeJson = path.join(repoRoot, "opencode.json");

function parseArgs() {
  const args = process.argv.slice(2);
  return { verify: args.includes("--verify"), verifyOnly: args.includes("--verify-only") };
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

function verifyOpenCodeJson() {
  if (!fs.existsSync(srcOpenCodeJson)) fail(`Error: source file not found: ${srcOpenCodeJson}`);
  if (!fs.existsSync(destOpenCodeJson)) fail("Integrity verification FAILED:\n  Missing: root opencode.json does not exist");
  if (fs.readFileSync(srcOpenCodeJson, "utf8") !== fs.readFileSync(destOpenCodeJson, "utf8")) {
    fail("Integrity verification FAILED:\n  root opencode.json does not match src/opencode.json");
  }
  console.log("Integrity verification passed: root opencode.json matches src/opencode.json.");
}

function verifyIntegrity() {
  const source = collectRelativePaths(srcDir, srcDir);
  const destination = collectRelativePaths(destDir, destDir);
  const preserved = new Set(ROOT_ONLY);
  const synced = new Set([...destination].filter((relative) => !preserved.has(relative.split("/")[0])));
  const missing = [...source].filter((relative) => !synced.has(relative));
  const extra = [...synced].filter((relative) => !source.has(relative));
  if (missing.length || extra.length) {
    let message = "Integrity verification FAILED:";
    if (missing.length) message += `\n  Missing in root .opencode/ (${missing.length}):\n${missing.map((item) => `    - ${item}`).join("\n")}`;
    if (extra.length) message += `\n  Extra in root .opencode/ (${extra.length}):\n${extra.map((item) => `    - ${item}`).join("\n")}`;
    fail(message);
  }
  console.log(`Integrity verification passed: ${source.size} src entr${source.size === 1 ? "y" : "ies"} match root .opencode/.`);

  // Mode 2 drift: any non-.opencode file under src/ that's missing at root.
  const srcRoot = path.join(repoRoot, "src");
  const seedExcluded = new Set([".opencode", "opencode.json"]);
  const seedEntries = [...collectRelativePaths(srcRoot, srcRoot)].filter(
    (relative) => !seedExcluded.has(relative.split("/")[0])
  );
  const missingSeed = seedEntries.filter(
    (relative) => !fs.existsSync(path.join(repoRoot, relative.split("/").join(path.sep)))
  );
  if (missingSeed.length) {
    fail(`Integrity verification FAILED:\n  Mode 2 drift — files in src/ missing from root (${missingSeed.length}):\n${missingSeed.map((item) => `    - ${item}`).join("\n")}`);
  }
  console.log("Mode 2 integrity verification passed: no seed files missing from root.");
}

function main() {
  const flags = parseArgs();
  if (flags.verifyOnly && flags.verify) console.log("Note: --verify is redundant with --verify-only; ignoring --verify.");
  if (!fs.existsSync(srcDir)) fail(`Error: source directory not found: ${srcDir}`);
  if (flags.verifyOnly) {
    verifyIntegrity();
    verifyOpenCodeJson();
    return;
  }
  deploy({ sourceDir: srcDir, destinationDir: destDir, sourceJson: srcOpenCodeJson, destinationJson: destOpenCodeJson });
  console.log("Root .opencode/ and opencode.json are now up to date with src/.");
  const srcRoot = path.join(repoRoot, "src");
  const repoRootResolved = path.resolve(repoRoot);
  for (const entry of fs.readdirSync(srcRoot)) {
    if (entry === ".opencode" || entry === "opencode.json") continue;
    copyMissing(path.join(srcRoot, entry), path.join(repoRoot, entry), false, console.log, repoRootResolved);
  }
  console.log("Seed files are never overwritten; managed .opencode/ and opencode.json are overwritten.");
  if (flags.verify) {
    verifyIntegrity();
    verifyOpenCodeJson();
  }
}

main();
