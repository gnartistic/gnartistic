// Reads pre-computed stats from data/lines.json (updated daily by CI).

import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { sendSvg, sendError, theme } from "../_lib/card.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default async function handler(req, res) {
  try {
    const dataPath = path.join(__dirname, "..", "..", "data", "lines.json");
    const raw = await readFile(dataPath, "utf8");
    const { additions, deletions, net, countedRepos, updatedAt } = JSON.parse(raw);

    const fmt = (n) => Number(n).toLocaleString("en-US");

    const svg = `
<svg width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${theme.bg1}"/>
      <stop offset="100%" stop-color="${theme.bg2}"/>
    </linearGradient>
  </defs>
  <rect width="400" height="400" rx="16" fill="url(#bg)"/>
  <text x="200" y="60" font-family="-apple-system, Segoe UI, sans-serif" font-size="24" font-weight="700" fill="${theme.accent}" text-anchor="middle">Lines of Code</text>
  <text x="200" y="185" font-family="-apple-system, Segoe UI, sans-serif" font-size="64" font-weight="800" fill="${theme.green}" text-anchor="middle">${fmt(additions)}</text>
  <text x="200" y="225" font-family="-apple-system, Segoe UI, sans-serif" font-size="18" fill="${theme.text}" text-anchor="middle">lines added</text>
  <text x="200" y="275" font-family="-apple-system, Segoe UI, sans-serif" font-size="16" fill="${theme.muted}" text-anchor="middle">${fmt(deletions)} deleted · net ${fmt(net)}</text>
  <text x="200" y="310" font-family="-apple-system, Segoe UI, sans-serif" font-size="16" fill="${theme.subtext}" text-anchor="middle">${countedRepos} repositories</text>
  <text x="200" y="380" font-family="-apple-system, Segoe UI, sans-serif" font-size="12" fill="${theme.muted}" text-anchor="middle">${new Date(updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</text>
</svg>`.trim();

    sendSvg(res, svg, { maxAge: 3600 });
  } catch (err) {
    sendError(res, "lines data not yet computed — run the workflow");
  }
}
