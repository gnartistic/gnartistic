// "Let's Connect" terminal widget — shows npx gnartistic running with output

import { sendSvg } from "../_lib/card.mjs";

const theme = {
  bg1: "#1a1b27",
  bg2: "#24283b",
  accent: "#7aa2f7",
  text: "#c0caf5",
  subtext: "#7aa2f7",
  muted: "#565f89",
  green: "#9ece6a",
  orange: "#ff9e64",
};

export default function handler(req, res) {
  const svg = `
<svg width="600" height="320" viewBox="0 0 600 320" xmlns="http://www.w3.org/2000/svg">
  <style>
    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }
    @keyframes cmd   { 0%, 5%  { width: 0 } 12%, 100% { width: 200px } }
    @keyframes o1    { 0%, 18% { opacity: 0 } 22%, 100% { opacity: 1 } }
    @keyframes o2    { 0%, 28% { opacity: 0 } 32%, 100% { opacity: 1 } }
    @keyframes o3    { 0%, 38% { opacity: 0 } 42%, 100% { opacity: 1 } }
    @keyframes o4    { 0%, 48% { opacity: 0 } 52%, 100% { opacity: 1 } }
    @keyframes o5    { 0%, 58% { opacity: 0 } 62%, 100% { opacity: 1 } }
    @keyframes o6    { 0%, 68% { opacity: 0 } 72%, 100% { opacity: 1 } }
    @keyframes p2    { 0%, 78% { opacity: 0 } 82%, 100% { opacity: 1 } }
    .cursor { animation: blink 1s step-end infinite; }
    .cmd { overflow: hidden; white-space: nowrap; display: inline-block; animation: cmd 16s steps(20) infinite; }
    .o1 { opacity: 0; animation: o1 16s ease infinite; }
    .o2 { opacity: 0; animation: o2 16s ease infinite; }
    .o3 { opacity: 0; animation: o3 16s ease infinite; }
    .o4 { opacity: 0; animation: o4 16s ease infinite; }
    .o5 { opacity: 0; animation: o5 16s ease infinite; }
    .o6 { opacity: 0; animation: o6 16s ease infinite; }
    .p2 { opacity: 0; animation: p2 16s ease infinite; }
  </style>

  <!-- Window -->
  <rect width="600" height="320" rx="14" fill="${theme.bg1}"/>

  <!-- Title bar -->
  <rect width="600" height="36" rx="14" fill="${theme.bg2}"/>
  <rect y="22" width="600" height="14" fill="${theme.bg2}"/>
  <circle cx="20" cy="18" r="6" fill="#ff5f56"/>
  <circle cx="40" cy="18" r="6" fill="#ffbd2e"/>
  <circle cx="60" cy="18" r="6" fill="#27c93f"/>
  <text x="300" y="23" font-family="ui-monospace, Menlo, monospace" font-size="12" fill="${theme.muted}" text-anchor="middle">let's connect</text>

  <g font-family="ui-monospace, Menlo, monospace" font-size="15">

    <!-- Command -->
    <text x="24" y="68" fill="${theme.accent}">~</text>
    <text x="38" y="68" fill="${theme.subtext}"> $ </text>
    <g class="cmd">
      <text x="62" y="68" fill="${theme.text}">npx gnartistic</text>
    </g>

    <!-- Output -->
    <text class="o1" x="24" y="104" fill="${theme.green}">  Connecting to Charles Houston...</text>

    <text class="o2" x="24" y="140" fill="${theme.orange}">  LinkedIn</text>
    <text class="o2" x="140" y="140" fill="${theme.muted}">linkedin.com/in/charles-houston-43220a236</text>

    <text class="o3" x="24" y="168" fill="${theme.orange}">  Portfolio</text>
    <text class="o3" x="140" y="168" fill="${theme.muted}">gnartistic.github.io/react-portfolio</text>

    <text class="o4" x="24" y="196" fill="${theme.orange}">  Calendly</text>
    <text class="o4" x="140" y="196" fill="${theme.muted}">calendly.com/gn4rtistic/30min</text>

    <text class="o5" x="24" y="224" fill="${theme.orange}">  GitHub</text>
    <text class="o5" x="140" y="224" fill="${theme.muted}">github.com/gnartistic</text>

    <text class="o6" x="24" y="262" fill="${theme.green}">  Done. Let's build something cool.</text>

    <!-- Second prompt -->
    <g class="p2">
      <text x="24" y="296" fill="${theme.accent}">~</text>
      <text x="38" y="296" fill="${theme.subtext}"> $ </text>
      <rect x="62" y="282" width="9" height="17" rx="1" fill="${theme.accent}" class="cursor"/>
    </g>
  </g>
</svg>`.trim();

  sendSvg(res, svg, { maxAge: 86400 });
}
