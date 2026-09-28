import { cn } from "cn";
import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { useSyncExternalStore } from "react";

import { THEME_KEY, applyTheme, storedTheme } from "@/lib/theme";
import type { Theme } from "@/lib/theme";

const options = [
  { icon: SunIcon, label: "Light", value: "light" },
  { icon: MoonIcon, label: "Dark", value: "dark" },
  { icon: MonitorIcon, label: "System", value: "system" },
] as const;

// Same-tab changes don't fire "storage", so the toggle announces its own.
const THEME_EVENT = "themechange";

const subscribe = (onChange: () => void) => {
  const onStorage = (event: StorageEvent) => {
    if (event.key === THEME_KEY) {
      onChange();
    }
  };
  window.addEventListener(THEME_EVENT, onChange);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(THEME_EVENT, onChange);
    window.removeEventListener("storage", onStorage);
  };
};

export const ThemeToggle = () => {
  // The server has no localStorage, so it renders "system" and the client
  // switches to the stored choice after hydration.
  const theme = useSyncExternalStore<Theme>(
    subscribe,
    storedTheme,
    () => "system"
  );

  return (
    <fieldset className="bg-muted inline-flex w-fit gap-0.5 rounded-full border-0 p-0.5">
      <legend className="sr-only">Theme</legend>
      {options.map(({ icon: Icon, label, value }) => (
        <button
          key={value}
          type="button"
          aria-pressed={theme === value}
          aria-label={label}
          title={label}
          onClick={() => {
            applyTheme(value);
            window.dispatchEvent(new Event(THEME_EVENT));
          }}
          className={cn(
            "text-muted-foreground hover:text-foreground flex size-7 items-center justify-center rounded-full transition-colors",
            theme === value && "bg-background text-foreground shadow-xs"
          )}
        >
          <Icon aria-hidden className="size-3.5" />
        </button>
      ))}
    </fieldset>
  );
};
