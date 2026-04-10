import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { sendSvg, sendError, theme } from "../_lib/card.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default async function handler(req, res) {
  try {
    const dataPath = path.join(__dirname, "..", "..", "data", "lines.json");
    const raw = await readFile(dataPath, "utf8");
    const { additions, deletions, net, countedRepos } = JSON.parse(raw);

    const fmt = (n) => Number(n).toLocaleString("en-US");

    const svg = `
<svg width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${theme.bg1}"/>
      <stop offset="100%" stop-color="${theme.bg2}"/>
    </linearGradient>
  </defs>
  <rect width="400" height="400" rx="12" fill="url(#bg)"/>
  <text x="200" y="80" font-family="-apple-system, Segoe UI, sans-serif" font-size="20" font-weight="700" fill="${theme.accent}" text-anchor="middle">LINES OF CODE</text>
  <text x="200" y="210" font-family="-apple-system, Segoe UI, sans-serif" font-size="72" font-weight="800" fill="${theme.green}" text-anchor="middle">${fmt(additions)}</text>
  <text x="200" y="260" font-family="-apple-system, Segoe UI, sans-serif" font-size="20" fill="${theme.text}" text-anchor="middle">lines added</text>
  <text x="200" y="310" font-family="-apple-system, Segoe UI, sans-serif" font-size="18" fill="${theme.muted}" text-anchor="middle">${fmt(deletions)} deleted · net ${fmt(net)}</text>
  <text x="200" y="345" font-family="-apple-system, Segoe UI, sans-serif" font-size="18" fill="${theme.subtext}" text-anchor="middle">${countedRepos} repositories</text>
</svg>`.trim();

    sendSvg(res, svg, { maxAge: 3600 });
  } catch (err) {
    sendError(res, "run the workflow first");
  }
}
