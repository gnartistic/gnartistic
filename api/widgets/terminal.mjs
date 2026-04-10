// Custom animated terminal widget — Tokyo Night themed
// Types out a command, then prints bio info as JSON output line by line.

import { sendSvg } from "../_lib/card.mjs";

export default function handler(req, res) {
  const svg = `
<svg width="420" height="440" viewBox="0 0 420 440" xmlns="http://www.w3.org/2000/svg">
  <style>
    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }
    @keyframes cmd   { 0%, 4%  { width: 0 } 8%, 100%  { width: 240px } }
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
    .cmd { overflow: hidden; white-space: nowrap; display: inline-block; animation: cmd 12s steps(25) infinite; }
    .o1  { opacity: 0; animation: out1  12s ease infinite; }
    .o2  { opacity: 0; animation: out2  12s ease infinite; }
    .o3  { opacity: 0; animation: out3  12s ease infinite; }
    .o4  { opacity: 0; animation: out4  12s ease infinite; }
    .o5  { opacity: 0; animation: out5  12s ease infinite; }
    .o6  { opacity: 0; animation: out6  12s ease infinite; }
    .o7  { opacity: 0; animation: out7  12s ease infinite; }
    .o8  { opacity: 0; animation: out8  12s ease infinite; }
    .o9  { opacity: 0; animation: out9  12s ease infinite; }
    .o10 { opacity: 0; animation: out10 12s ease infinite; }
    .o11 { opacity: 0; animation: out11 12s ease infinite; }
    .p2  { opacity: 0; animation: prompt2 12s ease infinite; }
  </style>

  <!-- Window -->
  <rect width="420" height="440" rx="12" fill="#1a1b27"/>

  <!-- Title bar -->
  <rect width="420" height="32" rx="12" fill="#24283b"/>
  <rect y="20" width="420" height="12" fill="#24283b"/>
  <circle cx="18" cy="16" r="6" fill="#ff5f56"/>
  <circle cx="38" cy="16" r="6" fill="#ffbd2e"/>
  <circle cx="58" cy="16" r="6" fill="#27c93f"/>
  <text x="210" y="20" font-family="ui-monospace, Menlo, monospace" font-size="11" fill="#565f89" text-anchor="middle">charles@shenhav ~ zsh</text>

  <g font-family="ui-monospace, Menlo, monospace" font-size="12">

    <!-- Command -->
    <text x="16" y="58" fill="#bb9af7">~</text>
    <text x="28" y="58" fill="#7aa2f7"> $ </text>
    <g class="cmd">
      <text x="48" y="58" fill="#c0caf5">npx charles --about</text>
    </g>

    <!-- JSON output -->
    <text class="o1"  x="16" y="84"  fill="#565f89">{</text>
    <text class="o2"  x="28" y="106" fill="#bb9af7">  pronouns:</text>
    <text class="o2"  x="138" y="106" fill="#9ece6a">    "he/him"</text>
    <text class="o3"  x="28" y="128" fill="#bb9af7">  role:</text>
    <text class="o3"  x="138" y="128" fill="#9ece6a">        "CTO @ Shenhav"</text>
    <text class="o4"  x="28" y="150" fill="#bb9af7">  focus:</text>
    <text class="o4"  x="138" y="150" fill="#9ece6a">       "AI agents &amp; LLM tooling"</text>
    <text class="o5"  x="28" y="172" fill="#bb9af7">  stack:</text>
    <text class="o5"  x="138" y="172" fill="#7aa2f7">       ["TS", "Next.js", "tRPC",</text>
    <text class="o5"  x="138" y="192" fill="#7aa2f7">        "Prisma", "Tailwind"]</text>
    <text class="o6"  x="28" y="214" fill="#bb9af7">  offTheClock:</text>
    <text class="o6"  x="138" y="214" fill="#565f89"> [</text>
    <text class="o7"  x="148" y="236" fill="#ff9e64">"hiking (no elevation gain)"</text>
    <text class="o8"  x="148" y="258" fill="#ff9e64">"basement jam sessions"</text>
    <text class="o9"  x="148" y="280" fill="#ff9e64">"creating w/ my hands"</text>
    <text class="o10" x="148" y="302" fill="#ff9e64">"riding rails @ festivals"</text>
    <text class="o10" x="138" y="322" fill="#565f89">]</text>
    <text class="o11" x="28" y="344" fill="#bb9af7">  funFact:</text>
    <text class="o11" x="138" y="344" fill="#9ece6a">     "fully ambidextrous ✍️"</text>
    <text class="o11" x="16" y="366" fill="#565f89">}</text>

    <!-- Second prompt -->
    <g class="p2">
      <text x="16" y="396" fill="#bb9af7">~</text>
      <text x="28" y="396" fill="#7aa2f7"> $ </text>
      <rect x="48" y="383" width="8" height="15" rx="1" fill="#bb9af7" class="cursor"/>
    </g>
  </g>
</svg>`.trim();

  sendSvg(res, svg, { maxAge: 86400 });
}
