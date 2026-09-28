// Light/dark mode. The choice lives in localStorage; "system" (or nothing
// stored) follows the OS setting.

export const THEME_KEY = "theme";

export const themes = ["light", "dark", "system"] as const;
export type Theme = (typeof themes)[number];

// Inlined in <head> so the right theme is applied before first paint. Keep in
// sync with `applyTheme`.
export const themeScript = `(() => {
  const media = matchMedia("(prefers-color-scheme: dark)");
  const apply = () => {
    const theme = localStorage.getItem("${THEME_KEY}");
    const dark = theme === "dark" || (theme !== "light" && media.matches);
    document.documentElement.classList.toggle("dark", dark);
  };
  apply();
  media.addEventListener("change", apply);
})()`;

export const applyTheme = (theme: Theme) => {
  if (theme === "system") {
    localStorage.removeItem(THEME_KEY);
  } else {
    localStorage.setItem(THEME_KEY, theme);
  }
  const dark =
    theme === "dark" ||
    (theme === "system" && matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", dark);
};

export const storedTheme = (): Theme => {
  const theme = localStorage.getItem(THEME_KEY);
  return theme === "light" || theme === "dark" ? theme : "system";
};
