// Example widget: shows a simple "currently building" card.
// Embed in README with: ![](https://<your-vercel-domain>/api/widgets/now)

export default function handler(req, res) {
  const title = "Currently Building";
  const line1 = "Shenhav — AI-powered tooling";
  const line2 = "TypeScript · Next.js · tRPC · Prisma";

  const svg = `
<svg width="500" height="160" viewBox="0 0 500 160" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1a1b27"/>
      <stop offset="100%" stop-color="#24283b"/>
    </linearGradient>
  </defs>
  <rect width="500" height="160" rx="12" fill="url(#bg)"/>
  <text x="24" y="42" font-family="-apple-system, Segoe UI, sans-serif" font-size="18" font-weight="700" fill="#bb9af7">⚡ ${title}</text>
  <text x="24" y="80" font-family="-apple-system, Segoe UI, sans-serif" font-size="16" font-weight="600" fill="#c0caf5">${line1}</text>
  <text x="24" y="108" font-family="-apple-system, Segoe UI, sans-serif" font-size="13" fill="#7aa2f7">${line2}</text>
  <text x="24" y="138" font-family="-apple-system, Segoe UI, sans-serif" font-size="11" fill="#565f89">updated ${new Date().toUTCString()}</text>
</svg>`.trim();

  res.setHeader("Content-Type", "image/svg+xml");
  res.setHeader("Cache-Control", "public, max-age=1800, s-maxage=1800");
  res.status(200).send(svg);
}
