import { client } from "../_lib/github.mjs";
import { sendSvg, sendError, theme, escape } from "../_lib/card.mjs";

const USERNAME = "gnartistic";

export default async function handler(req, res) {
  try {
    const octokit = client();
    const events = await octokit.activity.listPublicEventsForUser({
      username: USERNAME,
      per_page: 30,
    });

    const push = events.data.find((e) => e.type === "PushEvent");
    if (!push) return sendError(res, "no recent pushes");

    const repoFull = push.repo.name;
    const repoName = repoFull.split("/")[1] || repoFull;
    const commit = push.payload.commits?.[push.payload.commits.length - 1];
    const message = (commit?.message || "").split("\n")[0].slice(0, 60);
    const when = timeAgo(new Date(push.created_at));

    const svg = `
<svg width="800" height="150" viewBox="0 0 800 150" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${theme.bg1}"/>
      <stop offset="100%" stop-color="${theme.bg2}"/>
    </linearGradient>
  </defs>
  <rect width="800" height="150" rx="12" fill="url(#bg)"/>
  <text x="30" y="42" font-family="-apple-system, Segoe UI, sans-serif" font-size="20" font-weight="700" fill="${theme.accent}">Latest Commit</text>
  <text x="30" y="90" font-family="-apple-system, Segoe UI, sans-serif" font-size="24" font-weight="700" fill="${theme.text}">${escape(repoName)}</text>
  <text x="30" y="120" font-family="ui-monospace, Menlo, monospace" font-size="14" fill="${theme.subtext}">"${escape(message)}"</text>
  <text x="700" y="90" font-family="-apple-system, Segoe UI, sans-serif" font-size="16" fill="${theme.muted}" text-anchor="end">${when}</text>
</svg>`.trim();

    sendSvg(res, svg, { maxAge: 600 });
  } catch (err) {
    sendError(res, err.message || "failed");
  }
}

function timeAgo(date) {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  const intervals = [
    [60 * 60 * 24, "day"],
    [60 * 60, "hour"],
    [60, "minute"],
    [1, "second"],
  ];
  for (const [s, label] of intervals) {
    const v = Math.floor(seconds / s);
    if (v >= 1) return `${v} ${label}${v > 1 ? "s" : ""} ago`;
  }
  return "just now";
}
