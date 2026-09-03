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
 * the src/ versions. Does not remove root-only files (node_modules, data,
 * package.json, .gitignore) that are not part of the src/ tree.
 *
 * Platform-independent: uses Node.js fs module only.
 */

const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");
const srcDir = path.join(repoRoot, "src", ".opencode");
const destDir = path.join(repoRoot, ".opencode");

function syncOpenCode() {
  // Verify source exists
  if (!fs.existsSync(srcDir)) {
    console.error(`Error: source directory not found: ${srcDir}`);
    process.exit(1);
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
    // Fallback for older Node versions that lack cpSync
    if (err.code === "ERR_FS_NO_CP_SYNC" || typeof fs.cpSync !== "function") {
      console.log("fs.cpSync not available; using recursive fallback copy.");
      copyDirRecursive(srcDir, destDir);
    } else {
      throw err;
    }
  }

  console.log(`Synced: ${srcDir} -> ${destDir}`);
  console.log("Root .opencode/ is now up to date with src/.opencode/.");
}

/**
 * Fallback recursive copy for Node versions without fs.cpSync.
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
