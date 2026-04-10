// Sums additions/deletions across all the user's repos and writes data/lines.json.
// Runs in CI (no timeout pressure), so it walks every non-fork repo.

import { Octokit } from "@octokit/rest";
import { writeFile, mkdir } from "node:fs/promises";

const USERNAME = "gnartistic";
const octokit = new Octokit({ auth: process.env.GH_TOKEN });

async function getStats(owner, repo, retries = 4) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await octokit.repos.getContributorsStats({ owner, repo });
      if (res.status === 200 && Array.isArray(res.data) && res.data.length > 0) {
        return res.data;
      }
    } catch (err) {
      console.warn(`  retry ${i + 1}: ${err.message}`);
    }
    await new Promise((r) => setTimeout(r, 1500));
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

const nonForks = repos.filter((r) => !r.fork);
console.log(`walking ${nonForks.length} repos...`);

for (let i = 0; i < nonForks.length; i++) {
  const repo = nonForks[i];
  const label = `[${i + 1}/${nonForks.length}] ${repo.full_name}`;
  try {
    const stats = await getStats(repo.owner.login, repo.name);
    const mine = stats.find((s) => s?.author?.login === USERNAME);
    if (mine) {
      let a = 0, d = 0;
      for (const week of mine.weeks) {
        a += week.a || 0;
        d += week.d || 0;
      }
      additions += a;
      deletions += d;
      countedRepos++;
      console.log(`${label}  +${a} -${d}`);
    } else {
      console.log(`${label}  (no contributions)`);
    }
  } catch (err) {
    console.warn(`${label}  skip: ${err.message}`);
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
