// Custom animated terminal widget — Tokyo Night themed

import { sendSvg } from "../_lib/card.mjs";

export default function handler(req, res) {
  const svg = `
<svg width="320" height="260" viewBox="0 0 320 260" xmlns="http://www.w3.org/2000/svg">
  <style>
    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }
    @keyframes type1 { 0%, 15% { width: 0 } 20%, 100% { width: 175px } }
    @keyframes type2 { 0%, 30% { width: 0 } 35%, 100% { width: 130px } }
    @keyframes type3 { 0%, 45% { width: 0 } 50%, 100% { width: 195px } }
    @keyframes type4 { 0%, 60% { width: 0 } 65%, 100% { width: 105px } }
    @keyframes type5 { 0%, 75% { width: 0 } 80%, 100% { width: 145px } }
    .cursor { animation: blink 1s step-end infinite; }
    .line1 { animation: type1 8s steps(20) infinite; }
    .line2 { animation: type2 8s steps(20) infinite; }
    .line3 { animation: type3 8s steps(20) infinite; }
    .line4 { animation: type4 8s steps(20) infinite; }
    .line5 { animation: type5 8s steps(20) infinite; }
    .typed { overflow: hidden; white-space: nowrap; display: inline-block; }
  </style>

  <!-- Window -->
  <rect width="320" height="260" rx="12" fill="#1a1b27"/>

  <!-- Title bar -->
  <rect width="320" height="32" rx="12" fill="#24283b"/>
  <rect y="20" width="320" height="12" fill="#24283b"/>
  <circle cx="18" cy="16" r="6" fill="#ff5f56"/>
  <circle cx="38" cy="16" r="6" fill="#ffbd2e"/>
  <circle cx="58" cy="16" r="6" fill="#27c93f"/>
  <text x="160" y="20" font-family="ui-monospace, Menlo, monospace" font-size="11" fill="#565f89" text-anchor="middle">charles@shenhav</text>

  <!-- Prompt lines -->
  <g font-family="ui-monospace, Menlo, monospace" font-size="13">
    <!-- Line 1 -->
    <text x="16" y="62" fill="#bb9af7">~</text>
    <text x="30" y="62" fill="#7aa2f7"> $ </text>
    <g class="typed line1">
      <text x="52" y="62" fill="#c0caf5">console.log("hey")</text>
    </g>

    <!-- Line 2 -->
    <text x="16" y="90" fill="#9ece6a">&gt;</text>
    <g class="typed line2">
      <text x="30" y="90" fill="#565f89"> "hey" // CTO mode</text>
    </g>

    <!-- Line 3 -->
    <text x="16" y="122" fill="#bb9af7">~</text>
    <text x="30" y="122" fill="#7aa2f7"> $ </text>
    <g class="typed line3">
      <text x="52" y="122" fill="#c0caf5">git commit -m "ship it"</text>
    </g>

    <!-- Line 4 -->
    <text x="16" y="150" fill="#9ece6a">&gt;</text>
    <g class="typed line4">
      <text x="30" y="150" fill="#565f89"> [main a1b2c3d]</text>
    </g>

    <!-- Line 5 -->
    <text x="16" y="182" fill="#bb9af7">~</text>
    <text x="30" y="182" fill="#7aa2f7"> $ </text>
    <g class="typed line5">
      <text x="52" y="182" fill="#c0caf5">building the future_</text>
    </g>

    <!-- Blinking cursor -->
    <rect x="52" y="200" width="8" height="16" rx="1" fill="#bb9af7" class="cursor"/>
    <text x="16" y="213" fill="#bb9af7">~</text>
    <text x="30" y="213" fill="#7aa2f7"> $ </text>
  </g>
</svg>`.trim();

  sendSvg(res, svg, { maxAge: 86400 });
}
