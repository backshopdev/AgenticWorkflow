#!/usr/bin/env node
"use strict";

/**
 * test-sync.js
 *
 * Automated tests for sync-opencode.js. Verifies:
 *   1. Sync runs without error
 *   2. All src/.opencode/ files exist in root .opencode/ after sync
 *   3. Root-only artifacts are preserved (not deleted)
 *   4. Stale files (in root but not in src) are removed
 *   5. --verify flag works correctly
 *   6. --verify detects discrepancies (negative test)
 *
 * Usage:
 *   node scripts/test-sync.js
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const repoRoot = path.resolve(__dirname, "..");
const srcDir = path.join(repoRoot, "src", ".opencode");
const destDir = path.join(repoRoot, ".opencode");
const syncScript = path.join(__dirname, "sync-opencode.js");

/**
 * Root-only artifacts that must be preserved after sync.
 * Must match the ROOT_ONLY list in sync-opencode.js.
 */
const ROOT_ONLY = [
  "node_modules",
  "package.json",
  "package-lock.json",
  ".gitignore",
  "data",
];

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  PASS: ${message}`);
    passed++;
  } else {
    console.error(`  FAIL: ${message}`);
    failed++;
  }
}

/**
 * Recursively collect all relative POSIX-style paths under a directory.
 */
function collectRelativePaths(dir, base) {
  const result = new Set();
  if (!fs.existsSync(dir)) {
    return result;
  }
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const rel = path
      .relative(base, path.join(dir, entry.name))
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

function runSync(args) {
  const cmd = `node "${syncScript}"${args ? " " + args : ""}`;
  return execSync(cmd, {
    cwd: repoRoot,
    encoding: "utf-8",
    stdio: ["pipe", "pipe", "pipe"],
  });
}

// ─── Test 1: Sync runs without error ────────────────────────────────────────
console.log("\nTest 1: Sync runs without error");
try {
  const output = runSync();
  assert(output.includes("Synced:"), "Sync reports success message");
  assert(
    output.includes("up to date"),
    "Sync reports 'up to date' message"
  );
} catch (err) {
  assert(false, `Sync ran without error (got: ${err.message})`);
}

// ─── Test 2: All src files exist in root after sync ─────────────────────────
console.log("\nTest 2: All src/.opencode/ files exist in root .opencode/");
const srcPaths = collectRelativePaths(srcDir, srcDir);
const destPaths = collectRelativePaths(destDir, destDir);

let allPresent = true;
for (const rel of srcPaths) {
  const destPath = path.join(destDir, rel);
  if (!fs.existsSync(destPath)) {
    assert(false, `Missing in root: ${rel}`);
    allPresent = false;
  }
}
if (allPresent) {
  assert(true, `All ${srcPaths.size} src entries present in root`);
}

// ─── Test 3: Root-only artifacts are preserved ──────────────────────────────
console.log("\nTest 3: Root-only artifacts are preserved after sync");

// Ensure root-only artifacts exist before sync (create any that are missing)
const createdArtifacts = [];
for (const artifact of ROOT_ONLY) {
  const artifactPath = path.join(destDir, artifact);
  if (!fs.existsSync(artifactPath)) {
    if (artifact === "node_modules" || artifact === "data") {
      fs.mkdirSync(artifactPath, { recursive: true });
    } else {
      fs.writeFileSync(artifactPath, "# test artifact\n");
    }
    createdArtifacts.push(artifact);
  }
}

// Run sync
try {
  runSync();
} catch (err) {
  assert(false, `Sync ran successfully in test 3 (got: ${err.message})`);
}

// Verify all root-only artifacts still exist
let allPreserved = true;
for (const artifact of ROOT_ONLY) {
  const artifactPath = path.join(destDir, artifact);
  if (!fs.existsSync(artifactPath)) {
    assert(false, `Root-only artifact deleted: ${artifact}`);
    allPreserved = false;
  }
}
if (allPreserved) {
  assert(true, "All root-only artifacts preserved");
}

// Clean up artifacts we created for this test
for (const artifact of createdArtifacts) {
  const artifactPath = path.join(destDir, artifact);
  if (fs.existsSync(artifactPath)) {
    const stat = fs.lstatSync(artifactPath);
    if (stat.isDirectory()) {
      fs.rmSync(artifactPath, { recursive: true });
    } else {
      fs.unlinkSync(artifactPath);
    }
  }
}

// ─── Test 4: Stale files are removed ────────────────────────────────────────
console.log("\nTest 4: Stale files are removed");

// Create a stale file in root .opencode/
const staleFile = path.join(destDir, "__stale_test_file__.tmp");
fs.writeFileSync(staleFile, "this should be removed by sync\n");
assert(fs.existsSync(staleFile), "Stale test file created");

// Create a stale directory in root .opencode/
const staleDir = path.join(destDir, "__stale_test_dir__");
fs.mkdirSync(staleDir, { recursive: true });
fs.writeFileSync(
  path.join(staleDir, "nested.txt"),
  "nested stale file\n"
);
assert(fs.existsSync(staleDir), "Stale test directory created");

// Run sync
try {
  runSync();
} catch (err) {
  assert(false, `Sync ran successfully in test 4 (got: ${err.message})`);
}

assert(!fs.existsSync(staleFile), "Stale file was removed");
assert(!fs.existsSync(staleDir), "Stale directory was removed");

// ─── Test 5: --verify flag works ────────────────────────────────────────────
console.log("\nTest 5: --verify flag reports success when in sync");
try {
  const output = runSync("--verify");
  assert(
    output.includes("Integrity verification passed"),
    "--verify reports integrity passed"
  );
} catch (err) {
  assert(false, `--verify ran without error (got: ${err.message})`);
}

// ─── Test 6: --verify detects discrepancies (negative test) ─────────────────
console.log("\nTest 6: --verify detects discrepancies (negative test)");

// Step 1: Ensure baseline is in sync
try {
  runSync();
} catch (err) {
  assert(false, `Baseline sync succeeded in test 6 (got: ${err.message})`);
}

// Step 2: Pick a known file and delete it from root to create a discrepancy
let targetFile = null;
for (const rel of srcPaths) {
  const destPath = path.join(destDir, rel);
  if (fs.existsSync(destPath) && fs.statSync(destPath).isFile()) {
    targetFile = rel;
    break;
  }
}

if (targetFile) {
  const targetPath = path.join(destDir, targetFile);
  fs.unlinkSync(targetPath);
  assert(
    !fs.existsSync(targetPath),
    `Deleted ${targetFile} from root to create discrepancy`
  );

  // Step 3: Run --verify-only and expect failure (exit code 1)
  // --verify-only runs integrity check without syncing, so the discrepancy persists
  let combinedOutput = "";
  let exitCode = null;
  try {
    combinedOutput = runSync("--verify-only");
    exitCode = 0;
  } catch (err) {
    exitCode = err.status;
    combinedOutput = (err.stdout || "") + "\n" + (err.stderr || "");
  }

  assert(
    exitCode === 1,
    `--verify-only exited with code 1 when discrepancy exists (got: ${exitCode})`
  );
  assert(
    combinedOutput.includes("Missing in root"),
    "--verify-only output reports missing file"
  );

  // Step 4: Re-sync to restore the deleted file for subsequent tests
  try {
    runSync();
    assert(
      fs.existsSync(targetPath),
      `Re-sync restored ${targetFile}`
    );
  } catch (err) {
    assert(false, `Re-sync succeeded in test 6 (got: ${err.message})`);
  }
} else {
  assert(false, "Could not find a src file to use for discrepancy test");
}

// ─── Summary ────────────────────────────────────────────────────────────────
console.log("\n" + "=".repeat(60));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log("=".repeat(60));

if (failed > 0) {
  process.exit(1);
} else {
  console.log("\nAll tests passed.");
  process.exit(0);
}
