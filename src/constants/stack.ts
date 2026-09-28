export interface Logo {
  name: string;
  src: string;
  /** Single-color black mark; inverted to white in dark mode. */
  mono?: boolean;
}

// Shown as avatar groups in the hero. Logos live in public/logos.
export const AGENTS: readonly Logo[] = [
  { name: "Claude Code", src: "/logos/claude-code.svg" },
  { name: "Codex", src: "/logos/codex.svg" },
  { mono: true, name: "Cursor", src: "/logos/cursor.svg" },
  { name: "Gemini CLI", src: "/logos/gemini-cli.svg" },
  { mono: true, name: "GitHub Copilot", src: "/logos/github-copilot.svg" },
  { mono: true, name: "opencode", src: "/logos/opencode.svg" },
  { name: "Amp", src: "/logos/amp.svg" },
  { mono: true, name: "Pi", src: "/logos/pi.svg" },
  { mono: true, name: "Hermes Agent", src: "/logos/hermes-agent.svg" },
];

export const RENDERERS: readonly Logo[] = [
  { name: "Remotion", src: "/logos/remotion.png" },
  { name: "HyperFrames", src: "/logos/hyperframes.png" },
  { mono: true, name: "Editframe", src: "/logos/editframe.png" },
  { name: "fframes", src: "/logos/fframes.svg" },
];
