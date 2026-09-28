export interface Logo {
  name: string;
  src: string;
}

// Shown as avatar groups in the hero. Logos live in public/logos.
export const AGENTS: readonly Logo[] = [
  { name: "Claude Code", src: "/logos/claude-code.svg" },
  { name: "Codex", src: "/logos/codex.svg" },
  { name: "Cursor", src: "/logos/cursor.svg" },
  { name: "Gemini CLI", src: "/logos/gemini-cli.svg" },
  { name: "GitHub Copilot", src: "/logos/github-copilot.svg" },
];

export const RENDERERS: readonly Logo[] = [
  { name: "Remotion", src: "/logos/remotion.png" },
  { name: "HyperFrames", src: "/logos/hyperframes.png" },
  { name: "Editframe", src: "/logos/editframe.png" },
  { name: "fframes", src: "/logos/fframes.svg" },
];
