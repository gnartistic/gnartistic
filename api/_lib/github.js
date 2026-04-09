import { Octokit } from "@octokit/rest";

export function client() {
  return new Octokit({
    auth: process.env.GH_TOKEN, // set this in Vercel project env
    userAgent: "gnartistic-widgets",
  });
}

// Wait + retry helper for the contributor stats endpoint, which returns 202
// while GitHub computes the data.
export async function getContributorStats(octokit, owner, repo, retries = 3) {
  for (let i = 0; i < retries; i++) {
    const res = await octokit.repos.getContributorsStats({ owner, repo });
    if (res.status === 200 && Array.isArray(res.data)) return res.data;
    await new Promise((r) => setTimeout(r, 1500));
  }
  return [];
}
