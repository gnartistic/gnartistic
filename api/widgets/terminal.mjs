// Custom animated terminal widget — Tokyo Night themed
// Types out a command, then prints bio info as JSON output line by line.

import { sendSvg } from "../_lib/card.mjs";

export default function handler(req, res) {
  const svg = `
<svg width="800" height="520" viewBox="0 0 800 520" xmlns="http://www.w3.org/2000/svg">
  <style>
    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }
    @keyframes cmd   { 0%, 4%  { width: 0 } 8%, 100%  { width: 320px } }
    @keyframes out1  { 0%, 10% { opacity: 0 } 12%, 100% { opacity: 1 } }
    @keyframes out2  { 0%, 16% { opacity: 0 } 18%, 100% { opacity: 1 } }
    @keyframes out3  { 0%, 22% { opacity: 0 } 24%, 100% { opacity: 1 } }
    @keyframes out4  { 0%, 28% { opacity: 0 } 30%, 100% { opacity: 1 } }
    @keyframes out5  { 0%, 34% { opacity: 0 } 36%, 100% { opacity: 1 } }
    @keyframes out6  { 0%, 40% { opacity: 0 } 42%, 100% { opacity: 1 } }
    @keyframes out7  { 0%, 46% { opacity: 0 } 48%, 100% { opacity: 1 } }
    @keyframes out8  { 0%, 52% { opacity: 0 } 54%, 100% { opacity: 1 } }
    @keyframes out9  { 0%, 58% { opacity: 0 } 60%, 100% { opacity: 1 } }
    @keyframes out10 { 0%, 64% { opacity: 0 } 66%, 100% { opacity: 1 } }
    @keyframes out11 { 0%, 70% { opacity: 0 } 72%, 100% { opacity: 1 } }
    @keyframes prompt2 { 0%, 76% { opacity: 0 } 78%, 100% { opacity: 1 } }
    .cursor { animation: blink 1s step-end infinite; }
    .cmd { overflow: hidden; white-space: nowrap; display: inline-block; animation: cmd 24s steps(25) infinite; }
    .o1  { opacity: 0; animation: out1  24s ease infinite; }
    .o2  { opacity: 0; animation: out2  24s ease infinite; }
    .o3  { opacity: 0; animation: out3  24s ease infinite; }
    .o4  { opacity: 0; animation: out4  24s ease infinite; }
    .o5  { opacity: 0; animation: out5  24s ease infinite; }
    .o6  { opacity: 0; animation: out6  24s ease infinite; }
    .o7  { opacity: 0; animation: out7  24s ease infinite; }
    .o8  { opacity: 0; animation: out8  24s ease infinite; }
    .o9  { opacity: 0; animation: out9  24s ease infinite; }
    .o10 { opacity: 0; animation: out10 24s ease infinite; }
    .o11 { opacity: 0; animation: out11 24s ease infinite; }
    .p2  { opacity: 0; animation: prompt2 24s ease infinite; }
  </style>

  <!-- Window -->
  <rect width="800" height="520" rx="14" fill="#1a1b27"/>

  <!-- Title bar -->
  <rect width="800" height="40" rx="14" fill="#24283b"/>
  <rect y="26" width="800" height="14" fill="#24283b"/>
  <circle cx="24" cy="20" r="7" fill="#ff5f56"/>
  <circle cx="48" cy="20" r="7" fill="#ffbd2e"/>
  <circle cx="72" cy="20" r="7" fill="#27c93f"/>
  <text x="400" y="25" font-family="ui-monospace, Menlo, monospace" font-size="14" fill="#565f89" text-anchor="middle">charles@shenhav ~ zsh</text>

  <g font-family="ui-monospace, Menlo, monospace" font-size="16">

    <!-- Command -->
    <text x="28" y="74" fill="#bb9af7">~</text>
    <text x="46" y="74" fill="#7aa2f7"> $ </text>
    <g class="cmd">
      <text x="72" y="74" fill="#c0caf5">npx charles --about</text>
    </g>

    <!-- JSON output -->
    <text class="o1"  x="28"  y="108" fill="#565f89">{</text>

    <text class="o2"  x="48"  y="138" fill="#bb9af7">pronouns:</text>
    <text class="o2"  x="220" y="138" fill="#9ece6a">"he/him"</text>

    <text class="o3"  x="48"  y="168" fill="#bb9af7">role:</text>
    <text class="o3"  x="220" y="168" fill="#9ece6a">"CTO @ Shenhav"</text>

    <text class="o4"  x="48"  y="198" fill="#bb9af7">focus:</text>
    <text class="o4"  x="220" y="198" fill="#9ece6a">"AI agents &amp; LLM tooling"</text>

    <text class="o5"  x="48"  y="228" fill="#bb9af7">stack:</text>
    <text class="o5"  x="220" y="228" fill="#7aa2f7">["TypeScript", "Next.js", "tRPC", "Prisma", "Tailwind"]</text>

    <text class="o6"  x="48"  y="258" fill="#bb9af7">offTheClock:</text>
    <text class="o6"  x="220" y="258" fill="#565f89">[</text>

    <text class="o7"  x="240" y="288" fill="#ff9e64">"hiking with no elevation gain"</text>
    <text class="o8"  x="240" y="318" fill="#ff9e64">"jamming in basements with my friends"</text>
    <text class="o9"  x="240" y="348" fill="#ff9e64">"creating things with my hands"</text>
    <text class="o10" x="240" y="378" fill="#ff9e64">"riding the rails at a music festival"</text>
    <text class="o10" x="220" y="408" fill="#565f89">]</text>

    <text class="o11" x="48"  y="438" fill="#bb9af7">funFact:</text>
    <text class="o11" x="220" y="438" fill="#9ece6a">"fully ambidextrous ✍️"</text>

    <text class="o11" x="28"  y="468" fill="#565f89">}</text>

    <!-- Second prompt -->
    <g class="p2">
      <text x="28" y="500" fill="#bb9af7">~</text>
      <text x="46" y="500" fill="#7aa2f7"> $ </text>
      <rect x="72" y="486" width="10" height="18" rx="1" fill="#bb9af7" class="cursor"/>
    </g>
  </g>
</svg>`.trim();

  sendSvg(res, svg, { maxAge: 86400 });
}
