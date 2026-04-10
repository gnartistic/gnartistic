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
      <text x="200" y="160" font-family="-apple-system, Segoe UI, sans-serif" font-size="48" font-weight="800" fill="${theme.green}" text-anchor="middle">${fmt(additions)}</text>
      <text x="200" y="190" font-family="-apple-system, Segoe UI, sans-serif" font-size="14" fill="${theme.text}" text-anchor="middle">lines added</text>
      <text x="200" y="240" font-family="-apple-system, Segoe UI, sans-serif" font-size="13" fill="${theme.muted}" text-anchor="middle">${fmt(deletions)} deleted · net ${fmt(net)}</text>
      <text x="200" y="270" font-family="-apple-system, Segoe UI, sans-serif" font-size="13" fill="${theme.subtext}" text-anchor="middle">across ${countedRepos} repositories</text>
      <text x="200" y="370" font-family="-apple-system, Segoe UI, sans-serif" font-size="10" fill="${theme.muted}" text-anchor="middle">updated ${new Date(updatedAt).toUTCString()}</text>
    `;

    const svg = card({ title: "📈 Lines of code written", body });
    sendSvg(res, svg, { maxAge: 3600 });
  } catch (err) {
    sendError(res, "lines data not yet computed — run the workflow");
  }
}
