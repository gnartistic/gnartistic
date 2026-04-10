// Top languages widget — aggregates byte counts across all your repos.

import { client } from "../_lib/github.mjs";
import { card, sendSvg, sendError, theme, escape } from "../_lib/card.mjs";

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
    // Authenticated listing includes private repos when the PAT has repo scope.
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
      const y = 70 + i * 28;
      const color = COLORS[lang] || theme.subtext;
      bars += `
        <text x="24" y="${y}" font-family="-apple-system, Segoe UI, sans-serif" font-size="13" font-weight="600" fill="${theme.text}">${escape(lang)}</text>
        <text x="376" y="${y}" font-family="-apple-system, Segoe UI, sans-serif" font-size="12" fill="${theme.muted}" text-anchor="end">${pct.toFixed(1)}%</text>
        <rect x="24" y="${y + 8}" width="352" height="8" rx="4" fill="${theme.bg1}"/>
        <rect x="24" y="${y + 8}" width="${(pct / 100) * 352}" height="8" rx="4" fill="${color}"/>
      `;
    });

    const svg = card({
      width: 400,
      height: 400,
      title: "💬 Top languages",
      body: bars,
    });
    sendSvg(res, svg, { maxAge: 21600 });
  } catch (err) {
    sendError(res, err.message || "failed");
  }
}
