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
<svg width="800" height="150" viewBox="0 0 800 150" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${theme.bg1}"/>
      <stop offset="100%" stop-color="${theme.bg2}"/>
    </linearGradient>
  </defs>
  <rect width="800" height="150" rx="12" fill="url(#bg)"/>
  <text x="30" y="42" font-family="-apple-system, Segoe UI, sans-serif" font-size="20" font-weight="700" fill="${theme.accent}">Lines of Code</text>
  <text x="30" y="95" font-family="-apple-system, Segoe UI, sans-serif" font-size="48" font-weight="800" fill="${theme.green}">${fmt(additions)}</text>
  <text x="350" y="80" font-family="-apple-system, Segoe UI, sans-serif" font-size="16" fill="${theme.text}">lines added</text>
  <text x="350" y="105" font-family="-apple-system, Segoe UI, sans-serif" font-size="14" fill="${theme.muted}">${fmt(deletions)} deleted · net ${fmt(net)}</text>
  <text x="630" y="80" font-family="-apple-system, Segoe UI, sans-serif" font-size="14" fill="${theme.subtext}">${countedRepos} repositories</text>
  <text x="630" y="105" font-family="-apple-system, Segoe UI, sans-serif" font-size="11" fill="${theme.muted}">${new Date(updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</text>
</svg>`.trim();

    sendSvg(res, svg, { maxAge: 3600 });
  } catch (err) {
    sendError(res, "lines data not yet computed — run the workflow");
  }
}
