// main.ts — Entrypoint for the Statistik Indonesia entry (Node 22, stdlib only).
//
// The site itself is plain static files under app/ (index.html, CSS, ES
// modules, no build step, no network use). This program hands the entry in:
// it copies app/ and screenshots/ next to this file into the output
// directory and writes dossier.json there with the vendored make.fun
// library (vendor/makefun-frontend.ts, kit copy, unchanged). The scorer
// requires dossier.json to be byte-for-byte what that library writes.
//
// Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// The program is deterministic: two runs write identical bytes.

import { cpSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const repoRoot = fileURLToPath(new URL(".", import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

mkdirSync(outputDir, { recursive: true });
cpSync(join(repoRoot, "app"), join(outputDir, "app"), { recursive: true });

const shotsDir = join(repoRoot, "screenshots");
mkdirSync(join(outputDir, "screenshots"), { recursive: true });
if (existsSync(shotsDir)) {
  cpSync(shotsDir, join(outputDir, "screenshots"), { recursive: true });
}

// Caps mirror the gate scorer: at most 4 screenshots of 256 KiB each,
// app/ at most 993 files/directories and 16 MiB, dossier text at most
// 160 KiB. buildDossier refuses anything past those limits.
const dossier = buildDossier(outputDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
});
writeFileSync(join(outputDir, "dossier.json"), dossier);
