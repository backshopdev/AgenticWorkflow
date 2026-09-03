#!/usr/bin/env node
"use strict";

/**
 * sync-opencode.js
 *
 * Copies the authoritative src/.opencode/ tree to the root .opencode/
 * deployment directory. The root copy is a deployed instance; all changes
 * must be made in src/ first and then synced here.
 *
 * Idempotent: safe to run multiple times. Overwrites existing files with
 * the src/ versions. Removes stale files from root that no longer exist
 * in src, while preserving root-only artifacts listed in ROOT_ONLY below.
 *
 * Platform-independent: uses Node.js fs module only.
 *
 * Usage:
 *   node scripts/sync-opencode.js            # sync only
 *   node scripts/sync-opencode.js --verify   # sync + integrity check
 *   node scripts/sync-opencode.js --verify-only  # integrity check only (no sync)
 */

const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");
const srcDir = path.join(repoRoot, "src", ".opencode");
const destDir = path.join(repoRoot, ".opencode");

/**
 * Root-only artifacts that must NEVER be deleted during stale-file removal.
 * These exist in root .opencode/ but not in src/.opencode/ and are managed
 * independently (e.g. by npm or the developer).
 */
const ROOT_ONLY = [
  "node_modules",
  "package.json",
  "package-lock.json",
  ".gitignore",
  "data",
];

/**
 * Parse command-line arguments.
 */
function parseArgs() {
  const args = process.argv.slice(2);
  return {
    verify: args.includes("--verify"),
    verifyOnly: args.includes("--verify-only"),
  };
}

/**
 * Recursively collect all relative paths (files and directories) under a
 * given root directory. Returns a Set of relative POSIX-style paths.
 */
function collectRelativePaths(dir, base) {
  const result = new Set();
  if (!fs.existsSync(dir)) {
    return result;
  }
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const rel = path.relative(base, path.join(dir, entry.name))
      .split(path.sep)
      .join("/");
    result.add(rel);
    if (entry.isDirectory()) {
      const childPaths = collectRelativePaths(
        path.join(dir, entry.name),
        base
      );
      for (const cp of childPaths) {
        result.add(cp);
      }
    }
  }
  return result;
}

/**
 * Remove files and directories in destDir that do not exist in srcDir,
 * except for entries in the ROOT_ONLY exclusion list.
 */
function removeStaleFiles() {
  const srcPaths = collectRelativePaths(srcDir, srcDir);
  const destPaths = collectRelativePaths(destDir, destDir);
  const rootOnlySet = new Set(ROOT_ONLY);

  // Collect stale entries: sort longest-first so children are removed
  // before their parents.
  const stale = [];
  for (const rel of destPaths) {
    const topLevel = rel.split("/")[0];
    if (rootOnlySet.has(topLevel)) {
      continue;
    }
    if (!srcPaths.has(rel)) {
      stale.push(rel);
    }
  }

  // Sort longest path first so nested items are deleted before parents.
  stale.sort((a, b) => b.split("/").length - a.split("/").length);

  let removedCount = 0;
  for (const rel of stale) {
    const fullPath = path.join(destDir, rel);
    if (!fs.existsSync(fullPath)) {
      continue; // already removed as part of a parent directory
    }
    const stat = fs.lstatSync(fullPath);
    if (stat.isDirectory()) {
      fs.rmSync(fullPath, { recursive: true });
      console.log(`Removed stale directory: ${rel}`);
    } else {
      fs.unlinkSync(fullPath);
      console.log(`Removed stale file: ${rel}`);
    }
    removedCount++;
  }

  if (removedCount === 0) {
    console.log("No stale files to remove.");
  } else {
    console.log(`Removed ${removedCount} stale entr${removedCount === 1 ? "y" : "ies"}.`);
  }

  return removedCount;
}

/**
 * Verify that root .opencode/ contains exactly the files from
 * src/.opencode/ plus the ROOT_ONLY artifacts.
 */
function verifyIntegrity() {
  const srcPaths = collectRelativePaths(srcDir, srcDir);
  const destPaths = collectRelativePaths(destDir, destDir);
  const rootOnlySet = new Set(ROOT_ONLY);

  // Filter dest paths to exclude root-only artifacts
  const destSynced = new Set();
  for (const rel of destPaths) {
    const topLevel = rel.split("/")[0];
    if (!rootOnlySet.has(topLevel)) {
      destSynced.add(rel);
    }
  }

  const missingInDest = [];
  for (const rel of srcPaths) {
    if (!destSynced.has(rel)) {
      missingInDest.push(rel);
    }
  }

  const extraInDest = [];
  for (const rel of destSynced) {
    if (!srcPaths.has(rel)) {
      extraInDest.push(rel);
    }
  }

  if (missingInDest.length > 0 || extraInDest.length > 0) {
    console.error("Integrity verification FAILED:");
    if (missingInDest.length > 0) {
      console.error(`  Missing in root .opencode/ (${missingInDest.length}):`);
      for (const p of missingInDest) {
        console.error(`    - ${p}`);
      }
    }
    if (extraInDest.length > 0) {
      console.error(`  Extra in root .opencode/ (${extraInDest.length}):`);
      for (const p of extraInDest) {
        console.error(`    - ${p}`);
      }
    }
    process.exit(1);
  }

  console.log(
    `Integrity verification passed: ${srcPaths.size} src entr${srcPaths.size === 1 ? "y" : "ies"} match root .opencode/.`
  );
}

function syncOpenCode() {
  const flags = parseArgs();

  if (flags.verifyOnly && flags.verify) {
    console.log(
      "Note: --verify is redundant with --verify-only; ignoring --verify."
    );
  }

  // Verify source exists
  if (!fs.existsSync(srcDir)) {
    console.error(`Error: source directory not found: ${srcDir}`);
    process.exit(1);
  }

  // If --verify-only, skip sync and only run integrity check
  if (flags.verifyOnly) {
    verifyIntegrity();
    return;
  }

  // Ensure destination exists
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
    console.log(`Created: ${destDir}`);
  }

  // Copy src/.opencode/ contents to root .opencode/
  // fs.cpSync with recursive:true and force:true overwrites existing files
  // and creates missing directories. Available since Node 16.7.0.
  try {
    fs.cpSync(srcDir, destDir, {
      recursive: true,
      force: true,
      // Preserve directory structure; overwrite files
    });
  } catch (err) {
    // N2: Two checks are needed here for complete coverage:
    //   - err.code === "ERR_FS_NO_CP_SYNC": cpSync exists but the underlying
    //     platform/filesystem does not support the copy-on-write or
    //     synchronous copy operation (e.g. certain network drives).
    //   - typeof fs.cpSync !== "function": cpSync does not exist at all
    //     because the Node.js version is older than 16.7.
    // Both conditions must be checked because the first handles a runtime
    // failure from a present API, while the second handles a missing API.
    if (err.code === "ERR_FS_NO_CP_SYNC" || typeof fs.cpSync !== "function") {
      console.log("fs.cpSync not available; using recursive fallback copy.");
      copyDirRecursive(srcDir, destDir);
    } else {
      throw err;
    }
  }

  console.log(`Synced: ${srcDir} -> ${destDir}`);

  // Remove stale files that exist in root but not in src
  removeStaleFiles();

  console.log("Root .opencode/ is now up to date with src/.opencode/.");

  // Optional integrity verification
  if (flags.verify) {
    verifyIntegrity();
  }
}

/**
 * Fallback recursive copy for Node versions without fs.cpSync.
 *
 * N1: This fallback uses fs.copyFileSync, which copies file content only.
 * It does NOT preserve timestamps, permissions, or other metadata. The
 * primary path (fs.cpSync) preserves more metadata by default. This
 * difference is acceptable because Node 16.7+ (which provides cpSync) is
 * widely available in all supported environments. The fallback exists only
 * for older or constrained runtimes where cpSync is unavailable.
 */
function copyDirRecursive(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

syncOpenCode();
