#!/usr/bin/env node
"use strict";

const path = require("path");
const { init, update } = require("./deploy-roundhouse");
const packageJson = require("../package.json");

const args = process.argv.slice(2);
const command = args.find((arg) => !arg.startsWith("-")) || "init";
const dryRun = args.includes("--dry-run");
const cwd = process.cwd();
const sourceDir = path.join(__dirname, "..", "src");
const sourceJson = path.join(__dirname, "..", "src", "opencode.json");

console.log(`Roundhouse v${packageJson.version}`);
console.log(`Target: ${cwd}`);
console.log(`Command: ${command}`);
console.log(`Template: ${sourceDir}`);
if (dryRun) console.log("Dry run: no files will be changed.");

try {
  if (!new Set(["init", "update"]).has(command)) throw new Error(`Unknown command '${command}'. Use init or update.`);
  const operation = command === "init" ? init : update;
  operation({ sourceDir, destinationDir: cwd, sourceJson, dryRun });
  console.log(dryRun ? "Dry run complete." : `${command} complete.`);
} catch (error) {
  console.error(`Deployment failed: ${error.message}`);
  process.exitCode = 1;
}
