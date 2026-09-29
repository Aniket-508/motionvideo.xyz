export const BASE_PRICE_CENTS = 7900;

export const formatUsd = (cents: number): string =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);

export const PERKS = [
  "Skills for any coding agent and renderer",
  "Storyboard skills, scene starters, and motion tokens",
  "Unlimited personal and client projects",
  "Updates pushed to the same repository",
] as const;
