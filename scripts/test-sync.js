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
 *   7. opencode.json content is synced from src
 *   8. --verify checks opencode.json integrity
 *   9. --verify-only detects opencode.json content discrepancy
 *  10. --verify-only detects missing root opencode.json
 *  11. Sync fails when src/opencode.json is missing
 *  12. Mode 2 creates missing seed files at root
 *  13. Mode 2 leaves existing seed files alone
 *  14. --verify-only detects Mode 2 drift
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
const srcOpenCodeJson = path.join(repoRoot, "src", "opencode.json");
const destOpenCodeJson = path.join(repoRoot, "opencode.json");
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

// ─── Test 7: opencode.json content is synced from src ───────────────────────
console.log("\nTest 7: opencode.json content is synced from src");
try {
  runSync();
} catch (err) {
  assert(false, `Sync ran without error in test 7 (got: ${err.message})`);
}

assert(
  fs.existsSync(destOpenCodeJson),
  "Root opencode.json exists after sync"
);

const srcJsonContent = fs.readFileSync(srcOpenCodeJson, "utf-8");
const destJsonContent = fs.readFileSync(destOpenCodeJson, "utf-8");
assert(
  srcJsonContent === destJsonContent,
  "Root opencode.json content matches src/opencode.json byte-for-byte"
);

// ─── Test 8: --verify checks opencode.json integrity ────────────────────────
console.log("\nTest 8: --verify checks opencode.json integrity");
try {
  const output = runSync("--verify");
  assert(
    output.includes("opencode.json matches src/opencode.json"),
    "--verify output confirms opencode.json integrity"
  );
} catch (err) {
  assert(
    false,
    `--verify ran without error in test 8 (got: ${err.message})`
  );
}

// ─── Test 9: --verify-only detects opencode.json content discrepancy ────────
console.log(
  "\nTest 9: --verify-only detects opencode.json content discrepancy"
);

// Ensure baseline is in sync
try {
  runSync();
} catch (err) {
  assert(
    false,
    `Baseline sync succeeded in test 9 (got: ${err.message})`
  );
}

// Modify root opencode.json to create a content discrepancy
const originalJsonContent = fs.readFileSync(destOpenCodeJson, "utf-8");
let test9ResyncError = null;
try {
  fs.writeFileSync(
    destOpenCodeJson,
    originalJsonContent + "\n// tampered\n",
    "utf-8"
  );
  assert(
    fs.readFileSync(destOpenCodeJson, "utf-8") !== srcJsonContent,
    "Root opencode.json modified to create discrepancy"
  );

  // Run --verify-only and expect failure
  let test9Output = "";
  let test9ExitCode = null;
  try {
    test9Output = runSync("--verify-only");
    test9ExitCode = 0;
  } catch (err) {
    test9ExitCode = err.status;
    test9Output = (err.stdout || "") + "\n" + (err.stderr || "");
  }

  assert(
    test9ExitCode === 1,
    `--verify-only exited with code 1 for opencode.json mismatch (got: ${test9ExitCode})`
  );
  assert(
    test9Output.includes("does not match src/opencode.json"),
    "--verify-only output reports opencode.json content mismatch"
  );
} finally {
  // Always restore root opencode.json, even if setup or verification fails.
  try {
    runSync();
  } catch (err) {
    test9ResyncError = err;
  } finally {
    if (
      !fs.existsSync(destOpenCodeJson) ||
      fs.readFileSync(destOpenCodeJson, "utf-8") !== originalJsonContent
    ) {
      fs.writeFileSync(destOpenCodeJson, originalJsonContent, "utf-8");
    }
  }
}

if (test9ResyncError) {
  assert(
    false,
    `Re-sync succeeded in test 9 (got: ${test9ResyncError.message})`
  );
}
const restoredJsonContent = fs.readFileSync(destOpenCodeJson, "utf-8");
assert(
  restoredJsonContent === srcJsonContent,
  "Re-sync restored root opencode.json content"
);

// ─── Test 10: --verify-only detects missing root opencode.json ──────────────
console.log("\nTest 10: --verify-only detects missing root opencode.json");

// Ensure baseline is in sync
try {
  runSync();
} catch (err) {
  assert(
    false,
    `Baseline sync succeeded in test 10 (got: ${err.message})`
  );
}

// Delete root opencode.json to create a missing-file discrepancy
fs.unlinkSync(destOpenCodeJson);
assert(
  !fs.existsSync(destOpenCodeJson),
  "Root opencode.json deleted to create discrepancy"
);

// Run --verify-only and expect failure
let test10Output = "";
let test10ExitCode = null;
try {
  test10Output = runSync("--verify-only");
  test10ExitCode = 0;
} catch (err) {
  test10ExitCode = err.status;
  test10Output = (err.stdout || "") + "\n" + (err.stderr || "");
}

assert(
  test10ExitCode === 1,
  `--verify-only exited with code 1 for missing opencode.json (got: ${test10ExitCode})`
);
assert(
  test10Output.includes("Missing") &&
    test10Output.includes("opencode.json"),
  "--verify-only output reports missing root opencode.json"
);

// Restore by re-syncing
try {
  runSync();
  assert(
    fs.existsSync(destOpenCodeJson),
    "Re-sync restored root opencode.json"
  );
} catch (err) {
  assert(false, `Re-sync succeeded in test 10 (got: ${err.message})`);
}

// ─── Test 11: Sync fails when src/opencode.json is missing ──────────────────
console.log("\nTest 11: Sync fails when src/opencode.json is missing");

// Temporarily rename src/opencode.json to simulate its absence
const tmpSrcJson = srcOpenCodeJson + ".tmp_test_backup";
let srcJsonWasRenamed = false;
try {
  fs.renameSync(srcOpenCodeJson, tmpSrcJson);
  srcJsonWasRenamed = true;
  assert(
    !fs.existsSync(srcOpenCodeJson),
    "src/opencode.json temporarily removed"
  );

  // Run sync and expect failure
  let test11Output = "";
  let test11ExitCode = null;
  try {
    test11Output = runSync();
    test11ExitCode = 0;
  } catch (err) {
    test11ExitCode = err.status;
    test11Output = (err.stdout || "") + "\n" + (err.stderr || "");
  }

  assert(
    test11ExitCode === 1,
    `Sync exited with code 1 when src/opencode.json missing (got: ${test11ExitCode})`
  );
  assert(
    test11Output.includes("source file not found") ||
      test11Output.includes("Error"),
    "Sync error message mentions missing source file"
  );
} finally {
  // Always restore src/opencode.json
  if (srcJsonWasRenamed && fs.existsSync(tmpSrcJson)) {
    fs.renameSync(tmpSrcJson, srcOpenCodeJson);
  }
}

assert(
  fs.existsSync(srcOpenCodeJson),
  "src/opencode.json restored after test"
);

// ─── Test 12: Mode 2 creates missing files at root ──────────────────────────
console.log("\nTest 12: Mode 2 creates missing files at root");

// Seed files used for Mode 2 verification. The pre-test state had neither
// file at root, so we delete any that exist to force Mode 2 to recreate them.
const buildingPath = path.join(repoRoot, "BUILDING.md");
const testingPath = path.join(repoRoot, "TESTING.md");
const srcBuildingPath = path.join(repoRoot, "src", "BUILDING.md");
const srcTestingPath = path.join(repoRoot, "src", "TESTING.md");
try { fs.unlinkSync(buildingPath); } catch {}
try { fs.unlinkSync(testingPath); } catch {}
assert(!fs.existsSync(buildingPath), "Pre-test: root/BUILDING.md deleted");
assert(!fs.existsSync(testingPath), "Pre-test: root/TESTING.md deleted");

try {
  runSync();
} catch (err) {
  assert(false, `Sync ran without error in test 12 (got: ${err.message})`);
}

const srcBuildingContent = fs.readFileSync(srcBuildingPath, "utf-8");
const srcTestingContent = fs.readFileSync(srcTestingPath, "utf-8");
assert(fs.existsSync(buildingPath), "Mode 2 created root/BUILDING.md");
assert(fs.existsSync(testingPath), "Mode 2 created root/TESTING.md");
assert(
  fs.readFileSync(buildingPath, "utf-8") === srcBuildingContent,
  "root/BUILDING.md content matches src/BUILDING.md"
);
assert(
  fs.readFileSync(testingPath, "utf-8") === srcTestingContent,
  "root/TESTING.md content matches src/TESTING.md"
);

// ─── Test 13: Mode 2 leaves existing files alone ───────────────────────────
console.log("\nTest 13: Mode 2 leaves existing files alone");

const sentinelContent = "# sentinel — Mode 2 must not overwrite\n";
fs.writeFileSync(buildingPath, sentinelContent, "utf-8");
assert(
  fs.readFileSync(buildingPath, "utf-8") === sentinelContent,
  "Sentinel written to root/BUILDING.md"
);

try {
  runSync();
} catch (err) {
  assert(false, `Sync ran without error in test 13 (got: ${err.message})`);
}

assert(
  fs.readFileSync(buildingPath, "utf-8") === sentinelContent,
  "Mode 2 did not overwrite sentinel content in root/BUILDING.md"
);
assert(
  fs.readFileSync(buildingPath, "utf-8") !== srcBuildingContent,
  "root/BUILDING.md still has sentinel content (not src content)"
);

// Clean up: delete the sentinel so the next sync re-creates it from src/
try { fs.unlinkSync(buildingPath); } catch {}

// ─── Test 14: --verify-only detects Mode 2 drift ────────────────────────────
console.log("\nTest 14: --verify-only detects Mode 2 drift");

// Ensure baseline is in sync (re-creates BUILDING.md from src/)
try {
  runSync();
} catch (err) {
  assert(false, `Baseline sync succeeded in test 14 (got: ${err.message})`);
}
assert(
  fs.existsSync(buildingPath),
  "Baseline: root/BUILDING.md present after sync"
);

// Delete root/BUILDING.md to create Mode 2 drift
fs.unlinkSync(buildingPath);
assert(
  !fs.existsSync(buildingPath),
  "root/BUILDING.md deleted to create Mode 2 drift"
);

// Run --verify-only and expect failure
let test14Output = "";
let test14ExitCode = null;
try {
  test14Output = runSync("--verify-only");
  test14ExitCode = 0;
} catch (err) {
  test14ExitCode = err.status;
  test14Output = (err.stdout || "") + "\n" + (err.stderr || "");
}

assert(
  test14ExitCode === 1,
  `--verify-only exited with code 1 for Mode 2 drift (got: ${test14ExitCode})`
);
assert(
  test14Output.includes("Mode 2 drift") ||
    test14Output.includes("missing from root"),
  "--verify-only output reports Mode 2 drift"
);

// Re-sync to clean state for any subsequent runs
try {
  runSync();
  assert(
    fs.existsSync(buildingPath),
    "Re-sync restored root/BUILDING.md"
  );
} catch (err) {
  assert(false, `Re-sync succeeded in test 14 (got: ${err.message})`);
}

// Final re-sync to ensure everything is clean for any subsequent runs. Test 14
// already re-synced after restoring BUILDING.md, so this is defense-in-depth:
// after this call, BUILDING.md and TESTING.md exist at root with src content,
// matching the canonical post-sync state.
try {
  runSync();
} catch (err) {
  // Non-fatal: just log; the test assertions above are what matter
  console.error(
    `  Warning: final cleanup sync failed (got: ${err.message})`
  );
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
