#!/usr/bin/env node

import { promises as fs } from "node:fs";
import path from "node:path";
import process from "node:process";

const repoRoot = process.cwd();
const errors = [];

function addError(message) {
  errors.push(message);
}

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function readJsonFile(filePath, context) {
  let raw;
  try {
    raw = await fs.readFile(filePath, "utf8");
  } catch {
    addError(`${context} is missing: ${filePath}`);
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch (error) {
    addError(`${context} contains invalid JSON (${filePath}): ${error.message}`);
    return null;
  }
}

function parseFrontmatter(content) {
  const normalized = content.replace(/\r\n/g, "\n");
  if (!normalized.startsWith("---\n")) {
    return null;
  }

  const closingIndex = normalized.indexOf("\n---\n", 4);
  if (closingIndex === -1) {
    return null;
  }

  const fields = {};
  for (const line of normalized.slice(4, closingIndex).split("\n")) {
    const separator = line.indexOf(":");
    if (separator === -1) {
      continue;
    }
    fields[line.slice(0, separator).trim()] = line.slice(separator + 1).trim();
  }
  return fields;
}

async function walkFiles(dirPath) {
  const files = [];
  const stack = [dirPath];

  while (stack.length > 0) {
    const current = stack.pop();
    const entries = await fs.readdir(current, { withFileTypes: true });
    for (const entry of entries) {
      const entryPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(entryPath);
      } else if (entry.isFile()) {
        files.push(entryPath);
      }
    }
  }

  return files;
}

async function validateSkillFrontmatter() {
  const skillsDir = path.join(repoRoot, "skills");
  if (!(await pathExists(skillsDir))) {
    addError('Missing "skills/" directory.');
    return;
  }

  const files = await walkFiles(skillsDir);
  const skillFiles = files.filter((file) => path.basename(file) === "SKILL.md");
  if (skillFiles.length === 0) {
    addError("No skills/*/SKILL.md files found.");
    return;
  }

  for (const file of skillFiles) {
    const content = await fs.readFile(file, "utf8");
    const parsed = parseFrontmatter(content);
    const relative = path.relative(repoRoot, file);
    if (!parsed) {
      addError(`Skill missing YAML frontmatter: ${relative}`);
      continue;
    }
    for (const key of ["name", "description"]) {
      if (!parsed[key]) {
        addError(`Skill missing "${key}" in frontmatter: ${relative}`);
      }
    }
  }
}

async function main() {
  const manifestPath = path.join(repoRoot, ".cursor-plugin", "plugin.json");
  const manifest = await readJsonFile(manifestPath, "Plugin manifest");
  if (!manifest) {
    summarizeAndExit();
    return;
  }

  if (typeof manifest.name !== "string" || !/^[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?$/.test(manifest.name)) {
    addError('plugin.json "name" must be lowercase kebab-case.');
  }

  for (const [field, relPath] of [
    ["logo", manifest.logo],
    ["mcpServers", manifest.mcpServers],
    ["skills", manifest.skills],
  ]) {
    if (typeof relPath !== "string") {
      continue;
    }
    const resolved = path.resolve(repoRoot, relPath);
    if (!(await pathExists(resolved))) {
      addError(`plugin.json "${field}" references missing path: ${relPath}`);
    }
  }

  if (!(await pathExists(path.join(repoRoot, "mcp.json")))) {
    addError("Missing mcp.json at repository root.");
  }

  await validateSkillFrontmatter();
  summarizeAndExit();
}

function summarizeAndExit() {
  if (errors.length > 0) {
    console.error("Validation failed:");
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    process.exit(1);
  }

  console.log("Validation passed.");
}

await main();
