// Approximate total lines of code authored by a GitHub user.
// Sums `additions` across every commit you authored in every repo you own.
// Cached at the edge for 6h since this is heavy.

import { client, getContributorStats } from "../_lib/github.mjs";
import { card, sendSvg, sendError, theme } from "../_lib/card.mjs";

const USERNAME = "gnartistic";

export default async function handler(req, res) {
  try {
    const octokit = client();

    // Grab all repos the user owns (public + private if PAT has repo scope).
    const repos = await octokit.paginate(octokit.repos.listForAuthenticatedUser, {
      per_page: 100,
      affiliation: "owner",
    }).catch(async () => {
      // Fall back to public-only listing if no PAT scope.
      return octokit.paginate(octokit.repos.listForUser, {
        username: USERNAME,
        per_page: 100,
      });
    });

    let additions = 0;
    let deletions = 0;
    let countedRepos = 0;

    // Run sequentially to be gentle on the stats endpoint.
    for (const repo of repos) {
      if (repo.fork) continue; // skip forks so you don't double-count
      const stats = await getContributorStats(octokit, repo.owner.login, repo.name);
      const mine = stats.find((s) => s?.author?.login === USERNAME);
      if (mine) {
        for (const week of mine.weeks) {
          additions += week.a || 0;
          deletions += week.d || 0;
        }
        countedRepos++;
      }
    }

    const net = additions - deletions;
    const fmt = (n) => n.toLocaleString("en-US");

    const body = `
      <text x="24" y="80" font-family="-apple-system, Segoe UI, sans-serif" font-size="32" font-weight="800" fill="${theme.green}">${fmt(additions)}</text>
      <text x="24" y="100" font-family="-apple-system, Segoe UI, sans-serif" font-size="12" fill="${theme.muted}">lines added (${fmt(deletions)} deleted · net ${fmt(net)})</text>
      <text x="24" y="130" font-family="-apple-system, Segoe UI, sans-serif" font-size="11" fill="${theme.subtext}">across ${countedRepos} repositories</text>
      <text x="24" y="148" font-family="-apple-system, Segoe UI, sans-serif" font-size="9" fill="${theme.muted}">updated ${new Date().toUTCString()}</text>
    `;

    const svg = card({ title: "📈 Lines of code written", body });
    sendSvg(res, svg, { maxAge: 21600 }); // 6h
  } catch (err) {
    sendError(res, err.message || "failed to compute");
  }
}
