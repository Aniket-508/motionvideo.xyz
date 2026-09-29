export const BASE_PRICE_CENTS = 7900;
export const LAUNCH_PRICE_CENTS = 9900;
export const PREORDER_LIMIT = 100;
export const PRODUCT_NAME = "MotionVideo Skill Bundle";
export const PREORDER_PRODUCT_NAME = `Preorder — ${PRODUCT_NAME}`;

export interface Offer {
  active: boolean;
  sold: number;
  limit: number;
  released: boolean;
}

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
