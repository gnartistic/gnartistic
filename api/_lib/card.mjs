// Shared SVG card helpers — Tokyo Night theme to match the rest of the README.

export const theme = {
  bg1: "#1a1b27",
  bg2: "#24283b",
  accent: "#7aa2f7",
  text: "#c0caf5",
  subtext: "#7aa2f7",
  muted: "#565f89",
  green: "#9ece6a",
  orange: "#ff9e64",
};

export function card({ width = 400, height = 400, title, body }) {
  return `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${theme.bg1}"/>
      <stop offset="100%" stop-color="${theme.bg2}"/>
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" rx="12" fill="url(#bg)"/>
  <text x="24" y="40" font-family="-apple-system, Segoe UI, sans-serif" font-size="18" font-weight="700" fill="${theme.accent}">${escape(title)}</text>
  ${body}
</svg>`.trim();
}

export function escape(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function sendSvg(res, svg, { maxAge = 3600 } = {}) {
  res.setHeader("Content-Type", "image/svg+xml");
  res.setHeader("Cache-Control", `public, max-age=${maxAge}, s-maxage=${maxAge}`);
  res.status(200).send(svg);
}

export function sendError(res, message) {
  const svg = card({
    title: "⚠️ Widget error",
    body: `<text x="24" y="80" font-family="-apple-system, Segoe UI, sans-serif" font-size="14" fill="${theme.text}">${escape(message)}</text>`,
  });
  res.setHeader("Content-Type", "image/svg+xml");
  res.status(200).send(svg);
}
