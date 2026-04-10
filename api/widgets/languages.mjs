import { client } from "../_lib/github.mjs";
import { sendSvg, sendError, theme, escape } from "../_lib/card.mjs";

const USERNAME = "gnartistic";

const COLORS = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  HTML: "#e34c26",
  CSS: "#563d7c",
  SCSS: "#c6538c",
  Python: "#3572A5",
  Go: "#00ADD8",
  Rust: "#dea584",
  Swift: "#ffac45",
  Shell: "#89e051",
};

export default async function handler(req, res) {
  try {
    const octokit = client();
    const repos = await octokit.paginate(octokit.repos.listForAuthenticatedUser, {
      per_page: 100,
      affiliation: "owner,collaborator,organization_member",
    }).catch(() =>
      octokit.paginate(octokit.repos.listForUser, {
        username: USERNAME,
        per_page: 100,
      })
    );

    const totals = {};
    for (const repo of repos) {
      if (repo.fork) continue;
      const langs = await octokit.repos.listLanguages({
        owner: repo.owner.login,
        repo: repo.name,
      });
      for (const [lang, bytes] of Object.entries(langs.data)) {
        totals[lang] = (totals[lang] || 0) + bytes;
      }
    }

    const sorted = Object.entries(totals).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const total = sorted.reduce((a, [, v]) => a + v, 0);

    let bars = "";
    sorted.forEach(([lang, bytes], i) => {
      const pct = (bytes / total) * 100;
      const y = 68 + i * 40;
      const color = COLORS[lang] || theme.subtext;
      bars += `
        <text x="20" y="${y}" font-family="-apple-system, Segoe UI, sans-serif" font-size="14" font-weight="600" fill="${theme.text}">${escape(lang)}</text>
        <text x="380" y="${y}" font-family="-apple-system, Segoe UI, sans-serif" font-size="14" fill="${theme.muted}" text-anchor="end">${pct.toFixed(1)}%</text>
        <rect x="20" y="${y + 6}" width="360" height="8" rx="4" fill="${theme.bg1}"/>
        <rect x="20" y="${y + 6}" width="${(pct / 100) * 360}" height="8" rx="4" fill="${color}"/>
      `;
    });

    const h = 68 + sorted.length * 40 + 10;

    const svg = `
<svg width="400" height="${h}" viewBox="0 0 400 ${h}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${theme.bg1}"/>
      <stop offset="100%" stop-color="${theme.bg2}"/>
    </linearGradient>
  </defs>
  <rect width="400" height="${h}" rx="12" fill="url(#bg)"/>
  <text x="200" y="38" font-family="-apple-system, Segoe UI, sans-serif" font-size="16" font-weight="700" fill="${theme.accent}" text-anchor="middle">TOP LANGUAGES</text>
  ${bars}
</svg>`.trim();

    sendSvg(res, svg, { maxAge: 21600 });
  } catch (err) {
    sendError(res, err.message || "failed");
  }
}
