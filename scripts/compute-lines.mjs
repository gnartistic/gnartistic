// Sums additions/deletions across all the user's repos and writes data/lines.json.
// Runs in CI (no timeout pressure), so it walks every non-fork repo.

import { Octokit } from "@octokit/rest";
import { writeFile, mkdir } from "node:fs/promises";

const USERNAME = "gnartistic";
const octokit = new Octokit({ auth: process.env.GH_TOKEN });

async function getStats(owner, repo, retries = 5) {
  for (let i = 0; i < retries; i++) {
    const res = await octokit.repos.getContributorsStats({ owner, repo });
    if (res.status === 200 && Array.isArray(res.data)) return res.data;
    await new Promise((r) => setTimeout(r, 2000));
  }
  return [];
}

const repos = await octokit.paginate(octokit.repos.listForAuthenticatedUser, {
  per_page: 100,
  affiliation: "owner,collaborator,organization_member",
});

let additions = 0;
let deletions = 0;
let countedRepos = 0;

for (const repo of repos) {
  if (repo.fork) continue;
  try {
    const stats = await getStats(repo.owner.login, repo.name);
    const mine = stats.find((s) => s?.author?.login === USERNAME);
    if (mine) {
      for (const week of mine.weeks) {
        additions += week.a || 0;
        deletions += week.d || 0;
      }
      countedRepos++;
    }
  } catch (err) {
    console.warn(`skip ${repo.full_name}: ${err.message}`);
  }
}

await mkdir("data", { recursive: true });
await writeFile(
  "data/lines.json",
  JSON.stringify(
    { additions, deletions, net: additions - deletions, countedRepos, updatedAt: new Date().toISOString() },
    null,
    2
  )
);

console.log(`done — ${additions.toLocaleString()} additions across ${countedRepos} repos`);
