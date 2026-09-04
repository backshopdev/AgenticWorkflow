#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT_ONLY = ["node_modules", "package.json", "package-lock.json", ".gitignore", "data"];

function lstatIfPresent(file) {
  try { return fs.lstatSync(file); } catch (error) {
    if (error.code === "ENOENT") return null;
    throw error;
  }
}

function inside(root, candidate) {
  const relative = path.relative(root, candidate);
  return relative === "" || (relative !== ".." && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative));
}

function assertSafePath(root, candidate, label) {
  const absoluteRoot = path.resolve(root);
  const absoluteCandidate = path.resolve(candidate);
  if (!inside(absoluteRoot, absoluteCandidate)) throw new Error(`${label} escapes consumer cwd: ${candidate}`);
  let current = absoluteRoot;
  const relative = path.relative(absoluteRoot, absoluteCandidate);
  for (const part of relative ? relative.split(path.sep) : []) {
    current = path.join(current, part);
    const stat = lstatIfPresent(current);
    if (!stat) continue;
    if (stat.isSymbolicLink()) throw new Error(`${label} uses a symlink or junction: ${current}`);
    const real = fs.realpathSync(current);
    if (!inside(fs.realpathSync(absoluteRoot), real)) throw new Error(`${label} escapes consumer cwd: ${current}`);
  }
}

function assertSafeTree(root, label) {
  const stat = lstatIfPresent(root);
  if (!stat) return;
  if (stat.isSymbolicLink()) throw new Error(`${label} uses a symlink or junction: ${root}`);
  if (!stat.isDirectory()) return;
  for (const entry of fs.readdirSync(root)) assertSafeTree(path.join(root, entry), label);
}

// Node does not expose a portable directory-relative, no-follow equivalent for
// every operation used here (notably recursive removal and Windows junctions).
// Keep the checks immediately adjacent to mutations; this closes ordinary
// replacement mistakes, while the documented check-then-use race remains an
// unavoidable limitation for an untrusted process concurrently changing cwd.
function revalidateMutationPath(root, candidate, label, allowMissing = true) {
  assertSafePath(root, candidate, label);
  const stat = lstatIfPresent(candidate);
  if (!stat && !allowMissing) throw new Error(`${label} changed before mutation: ${candidate}`);
  if (stat?.isSymbolicLink()) throw new Error(`${label} uses a symlink or junction: ${candidate}`);
  return stat;
}

function mkdirSafe(root, directory, label) {
  const absolute = path.resolve(directory);
  const relative = path.relative(path.resolve(root), absolute);
  let current = path.resolve(root);
  for (const part of relative ? relative.split(path.sep) : []) {
    current = path.join(current, part);
    const stat = revalidateMutationPath(root, current, label);
    if (!stat) fs.mkdirSync(current);
  }
}

function copyFileSafe(root, source, destination, label) {
  const sourceStat = fs.lstatSync(source);
  if (sourceStat.isSymbolicLink() || !sourceStat.isFile()) throw new Error(`source uses a symlink or junction: ${source}`);
  revalidateMutationPath(root, path.dirname(destination), label, false);
  revalidateMutationPath(root, destination, label);
  fs.copyFileSync(source, destination);
}

function collectRelativePaths(dir, base) {
  const result = new Set();
  const stat = lstatIfPresent(dir);
  if (!stat) return result;
  if (stat.isSymbolicLink()) throw new Error(`source uses a symlink or junction: ${dir}`);
  if (!stat.isDirectory()) throw new Error(`expected directory: ${dir}`);
  for (const entry of fs.readdirSync(dir)) {
    const entryPath = path.join(dir, entry);
    const entryStat = fs.lstatSync(entryPath);
    if (entryStat.isSymbolicLink()) throw new Error(`source uses a symlink or junction: ${entryPath}`);
    const relative = path.relative(base, entryPath).split(path.sep).join("/");
    result.add(relative);
    if (entryStat.isDirectory()) for (const child of collectRelativePaths(entryPath, base)) result.add(child);
  }
  return result;
}

function ensureType(destination, sourceStat, mode, log, dryRun = false, consumerRoot = path.dirname(destination)) {
  const existing = lstatIfPresent(destination);
  if (!existing) return true;
  if (existing.isSymbolicLink()) throw new Error(`destination uses a symlink or junction: ${destination}`);
  const compatible = sourceStat.isDirectory() ? existing.isDirectory() : existing.isFile();
  if (compatible) return true;
  if (mode === "init") {
    log(`Skipped incompatible existing: ${destination}`);
    return false;
  }
  if (!dryRun) { revalidateMutationPath(consumerRoot, destination, "destination", false); fs.rmSync(destination, { recursive: existing.isDirectory(), force: true }); }
  return true;
}

function copyTree(source, destination, mode, dryRun, log, consumerRoot) {
  const sourceStat = fs.lstatSync(source);
  assertSafePath(consumerRoot, destination, "destination");
  const existing = lstatIfPresent(destination);
  if (sourceStat.isDirectory()) {
    const currentSource = fs.lstatSync(source);
    if (!currentSource.isDirectory() || currentSource.isSymbolicLink()) throw new Error(`source changed to a symlink or junction: ${source}`);
      if (!ensureType(destination, sourceStat, mode, log, dryRun, consumerRoot)) return;
      if (!existing) { log(`${dryRun ? "Would create" : "Created"}: ${destination}`); if (!dryRun) mkdirSafe(consumerRoot, destination, "destination"); }
    for (const entry of fs.readdirSync(source)) copyTree(path.join(source, entry), path.join(destination, entry), mode, dryRun, log, consumerRoot);
  } else {
    if (!ensureType(destination, sourceStat, mode, log, dryRun, consumerRoot)) return;
    if (existing) { if (mode === "init") log(`Skipped existing: ${destination}`); else log(`${dryRun ? "Would overwrite" : "Overwrote"}: ${destination}`); }
    else log(`${dryRun ? "Would create" : "Created"}: ${destination}`);
    if (!dryRun) { mkdirSafe(consumerRoot, path.dirname(destination), "destination"); copyFileSafe(consumerRoot, source, destination, "destination"); }
  }
}

function deploy({ sourceDir, destinationDir, sourceJson, destinationJson, dryRun = false, preserve = ROOT_ONLY, log = console.log }) {
  const sourceStat = lstatIfPresent(sourceDir);
  if (sourceStat?.isSymbolicLink()) throw new Error(`source uses a symlink or junction: ${sourceDir}`);
  if (!sourceStat?.isDirectory()) throw new Error(`source directory not found: ${sourceDir}`);
  if (!lstatIfPresent(sourceJson)?.isFile()) throw new Error(`source file not found: ${sourceJson}`);
  assertSafeTree(sourceDir, "source");
  const consumerRoot = path.resolve(path.dirname(destinationJson));
  assertSafePath(consumerRoot, destinationDir, "destination");
  const destinationStat = lstatIfPresent(destinationDir);
  if (destinationStat?.isSymbolicLink()) throw new Error(`destination uses a symlink or junction: ${destinationDir}`);
  if (destinationStat && !destinationStat.isDirectory()) throw new Error(`managed destination root must be a directory: ${destinationDir}`);
  const sourcePaths = collectRelativePaths(sourceDir, sourceDir);
  const destinationPaths = collectRelativePaths(destinationDir, destinationDir);
  const preserved = new Set(preserve);
  const stale = [...destinationPaths].filter((relative) => !preserved.has(relative.split("/")[0]) && !sourcePaths.has(relative)).sort((a, b) => b.split("/").length - a.split("/").length);
  if (!destinationStat) { log(`${dryRun ? "Would create" : "Created"}: ${destinationDir}`); if (!dryRun) mkdirSafe(consumerRoot, destinationDir, "destination"); }
  copyTree(sourceDir, destinationDir, "update", dryRun, log, consumerRoot);
  log(`${dryRun ? "Would sync" : "Synced"}: ${sourceDir} -> ${destinationDir}`);
  let removedCount = 0;
  for (const relative of stale) {
    const stalePath = path.join(destinationDir, relative);
    assertSafePath(consumerRoot, stalePath, "stale destination");
    if (!lstatIfPresent(stalePath)) continue;
    removedCount++; log(`${dryRun ? "Would remove stale" : "Removed stale"}: ${relative}`);
     if (!dryRun) { revalidateMutationPath(consumerRoot, stalePath, "stale destination", false); fs.rmSync(stalePath, { recursive: true, force: true }); }
  }
  log(removedCount === 0 ? "No stale files to remove." : `${dryRun ? "Would remove" : "Removed"} ${removedCount} stale entr${removedCount === 1 ? "y" : "ies"}.`);
  assertSafePath(consumerRoot, destinationJson, "destination");
  const jsonStat = fs.lstatSync(sourceJson);
  if (!ensureType(destinationJson, jsonStat, "update", log, dryRun, consumerRoot)) throw new Error(`cannot deploy configuration: ${destinationJson}`);
  log(`${dryRun ? "Would sync" : "Synced"}: ${sourceJson} -> ${destinationJson}`);
  if (!dryRun) { mkdirSafe(consumerRoot, path.dirname(destinationJson), "destination"); copyFileSafe(consumerRoot, sourceJson, destinationJson, "destination"); }
  return { staleCount: removedCount, sourceCount: sourcePaths.size };
}

function copyMissing(source, destination, dryRun, log, consumerRoot) {
  const stat = fs.lstatSync(source);
  assertSafePath(consumerRoot, destination, "destination");
  const existing = lstatIfPresent(destination);
  if (!ensureType(destination, stat, "init", log, dryRun, consumerRoot)) return;
  if (stat.isDirectory()) {
     const currentSource = fs.lstatSync(source);
     if (!currentSource.isDirectory() || currentSource.isSymbolicLink()) throw new Error(`source changed to a symlink or junction: ${source}`);
     if (!existing) { log(`${dryRun ? "Would create" : "Created"}: ${destination}`); if (!dryRun) mkdirSafe(consumerRoot, destination, "destination"); }
    for (const entry of fs.readdirSync(source)) copyMissing(path.join(source, entry), path.join(destination, entry), dryRun, log, consumerRoot);
  } else {
    if (existing) { log(`Skipped existing: ${destination}`); return; }
    log(`${dryRun ? "Would create" : "Created"}: ${destination}`);
     if (!dryRun) { mkdirSafe(consumerRoot, path.dirname(destination), "destination"); copyFileSafe(consumerRoot, source, destination, "destination"); }
  }
}

function init({ sourceDir, destinationDir, dryRun = false, log = console.log }) {
  const sourceStat = lstatIfPresent(sourceDir);
  if (sourceStat?.isSymbolicLink()) throw new Error(`source uses a symlink or junction: ${sourceDir}`);
  if (!sourceStat?.isDirectory()) throw new Error(`source directory not found: ${sourceDir}`);
  const root = path.resolve(destinationDir);
  for (const entry of fs.readdirSync(sourceDir)) copyMissing(path.join(sourceDir, entry), path.join(destinationDir, entry), dryRun, log, root);
}

function update({ sourceDir, destinationDir, sourceJson, dryRun = false, log = console.log }) {
  const sourceStat = lstatIfPresent(sourceDir);
  if (sourceStat?.isSymbolicLink()) throw new Error(`source uses a symlink or junction: ${sourceDir}`);
  if (!sourceStat?.isDirectory()) throw new Error(`source directory not found: ${sourceDir}`);
  const managed = path.join(sourceDir, ".opencode");
  deploy({ sourceDir: managed, destinationDir: path.join(destinationDir, ".opencode"), sourceJson, destinationJson: path.join(destinationDir, "opencode.json"), dryRun, preserve: [], log });
  const root = path.resolve(destinationDir);
  for (const entry of fs.readdirSync(sourceDir)) if (entry !== ".opencode" && entry !== "opencode.json") copyMissing(path.join(sourceDir, entry), path.join(destinationDir, entry), dryRun, log, root);
  log("Seed files are never overwritten; managed .opencode/ and opencode.json are overwritten.");
}

module.exports = { ROOT_ONLY, collectRelativePaths, copyMissing, deploy, init, update };
