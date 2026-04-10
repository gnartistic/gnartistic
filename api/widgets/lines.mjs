// Reads pre-computed stats from data/lines.json (updated daily by CI).
// Instant — no GitHub API calls at request time.

import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { card, sendSvg, sendError, theme } from "../_lib/card.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default async function handler(req, res) {
  try {
    const dataPath = path.join(__dirname, "..", "..", "data", "lines.json");
    const raw = await readFile(dataPath, "utf8");
    const { additions, deletions, net, countedRepos, updatedAt } = JSON.parse(raw);

    const fmt = (n) => Number(n).toLocaleString("en-US");

    const body = `
      <text x="24" y="80" font-family="-apple-system, Segoe UI, sans-serif" font-size="32" font-weight="800" fill="${theme.green}">${fmt(additions)}</text>
      <text x="24" y="100" font-family="-apple-system, Segoe UI, sans-serif" font-size="12" fill="${theme.muted}">lines added (${fmt(deletions)} deleted · net ${fmt(net)})</text>
      <text x="24" y="130" font-family="-apple-system, Segoe UI, sans-serif" font-size="11" fill="${theme.subtext}">across ${countedRepos} repositories</text>
      <text x="24" y="148" font-family="-apple-system, Segoe UI, sans-serif" font-size="9" fill="${theme.muted}">updated ${new Date(updatedAt).toUTCString()}</text>
    `;

    const svg = card({ title: "📈 Lines of code written", body });
    sendSvg(res, svg, { maxAge: 3600 });
  } catch (err) {
    sendError(res, "lines data not yet computed — run the workflow");
  }
}
