import type { Logo } from "@/constants/stack";

// Overlapping round logos followed by a short label, e.g. "Works with any agent".
export const LogoGroup = ({
  logos,
  label,
}: {
  logos: readonly Logo[];
  label: string;
}) => (
  <div className="flex items-center gap-3">
    <ul className="flex -space-x-1.5">
      {logos.map((logo) => (
        <li
          key={logo.name}
          title={logo.name}
          className="ring-background border-border flex size-7 items-center justify-center overflow-hidden rounded-full border bg-white ring-2"
        >
          <img
            src={logo.src}
            alt={logo.name}
            width={16}
            height={16}
            className="size-4 object-contain"
          />
        </li>
      ))}
    </ul>
    <span className="text-muted-foreground text-sm">{label}</span>
  </div>
);
