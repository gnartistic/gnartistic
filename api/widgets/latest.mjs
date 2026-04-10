// Latest commit widget — shows the most recent public push by the user.

import { client } from "../_lib/github.mjs";
import { card, sendSvg, sendError, theme, escape } from "../_lib/card.mjs";

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

    const repo = push.repo.name;
    const commit = push.payload.commits?.[push.payload.commits.length - 1];
    const message = (commit?.message || "").split("\n")[0].slice(0, 60);
    const when = timeAgo(new Date(push.created_at));

    const body = `
      <text x="200" y="160" font-family="-apple-system, Segoe UI, sans-serif" font-size="16" font-weight="700" fill="${theme.text}" text-anchor="middle">${escape(repo)}</text>
      <text x="200" y="200" font-family="ui-monospace, Menlo, monospace" font-size="13" fill="${theme.subtext}" text-anchor="middle">"${escape(message)}"</text>
      <text x="200" y="250" font-family="-apple-system, Segoe UI, sans-serif" font-size="13" fill="${theme.muted}" text-anchor="middle">${when}</text>
    `;

    const svg = card({ title: "🚀 Latest commit", body });
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
