// Site-wide copy and links. Edit here instead of hunting through components.

export const site = {
  name: "MotionVideo",
  domain: "motionvideo.xyz",
  url: "https://motionvideo.xyz",
  tagline: "Motion videos, animated by your agent.",
  description:
    "An agent skill pack that teaches Claude Code, Cursor, or Codex to render product videos from your real components, not a screen recording.",
  githubUrl: "https://github.com/motionvideohq/motionvideo.xyz",
  authorName: "Aniket",
  authorUrl: "https://github.com/Aniket-508",
  supportEmail: "hello@motionvideo.xyz",
  // Seller identity and governing law used on the terms/privacy/refund pages.
  operator: "Aniket Pawar",
  jurisdiction: "India",
  legalUpdatedAt: "September 28, 2026",
} as const;

export interface Logo {
  name: string;
  src: string;
}

// Shown as avatar groups in the hero. Logos live in public/logos.
export const agents: readonly Logo[] = [
  { name: "Claude Code", src: "/logos/claude-code.svg" },
  { name: "Codex", src: "/logos/codex.svg" },
  { name: "Cursor", src: "/logos/cursor.svg" },
  { name: "Gemini CLI", src: "/logos/gemini-cli.svg" },
  { name: "GitHub Copilot", src: "/logos/github-copilot.svg" },
];

export const renderers: readonly Logo[] = [
  { name: "Remotion", src: "/logos/remotion.png" },
  { name: "HyperFrames", src: "/logos/hyperframes.png" },
  { name: "Editframe", src: "/logos/editframe.png" },
  { name: "fframes", src: "/logos/fframes.svg" },
];

// Rendered videos. Empty entries show the animated placeholder instead.
export const videos = {
  hero: "",
  walkthrough: "",
  teaser: "",
} as const;

export const steps = [
  "Buy once and accept the invite to the private GitHub repo. Copy the skills folder into your project; your agent sets up your renderer on the first run.",
  "Ask for a video, like “a 15 second teaser for the new command palette”.",
  "Your agent drafts a storyboard, then rebuilds the screens from your design system.",
  "It checks key frames against the framing rules before rendering the final file.",
  "Ask for tweaks. It edits the scenes and renders again.",
] as const;

export const includes = [
  {
    title: "The playbook as skills",
    body: "Story, staging, scenes, typography, and setup, each written down as a skill your agent loads on demand.",
  },
  {
    title: "A reference film",
    body: "A complete multi-scene example your agent studies before it touches your product. Templates and config included.",
  },
  {
    title: "Camera and motion presets",
    body: "Zoom tiers, overlapping beats, tuned springs, and framing rules, shipped as code with the numbers filled in.",
  },
  {
    title: "A cursor set",
    body: "Animated cursors that move, click, and drag on the beat, so interactions read clearly on screen.",
  },
] as const;

export const faqs = [
  {
    q: "What exactly do I get?",
    a: "Access to the private skill pack repository: the skills, the reference film, motion presets, and the cursor set. You get every future update too.",
  },
  {
    q: "Does it work with my design system?",
    a: "Yes. The agent rebuilds scenes from your own components, tokens, and icons, so the video looks like your product rather than a generic template.",
  },
  {
    q: "Which agents does it work with?",
    a: "Anything that supports agent skills or can read markdown instructions from your repo: Claude Code, Cursor, Codex, and others.",
  },
  {
    q: "Do I need to pay for Remotion?",
    a: "Remotion is free for individuals and small companies. Larger companies need a Remotion company license; check remotion.dev/license for details.",
  },
  {
    q: "Can I use it for client work?",
    a: "Yes. One license covers any repo you work on, including client projects.",
  },
  {
    q: "Why is the price different in my country?",
    a: "We adjust the price to local purchasing power, so the discount is applied automatically at checkout based on where you are.",
  },
  {
    q: "Is this site open source?",
    a: "Yes, the website is open source on GitHub. The skill pack itself lives in a private repository you get access to after purchase.",
  },
] as const;

export const perks = [
  "Works with any coding agent and any renderer",
  "Skills, a reference film, presets, and a cursor set",
  "Works on your codebase or any live site",
  "One license, any repo, client work included",
  "Every future update, included",
] as const;
