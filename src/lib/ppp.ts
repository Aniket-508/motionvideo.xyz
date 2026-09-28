// Purchasing power parity (PPP) pricing.
//
// Each country maps to a discount tier derived from the World Bank price level
// ratio (PPP conversion factor / market exchange rate, US = 1.0), rounded to a
// tier. Countries not listed pay full price. Edit freely; after adding a new
// tier value, re-run `pnpm polar:setup` so Polar has a matching discount.
//
// Pure module: shared by the app and `scripts/polar-setup.ts`.

export const BASE_PRICE_CENTS = 7900;

export const PPP_TIERS = [20, 30, 40, 50, 60] as const;
export type PppTier = (typeof PPP_TIERS)[number];

const COUNTRIES_BY_TIER: Record<PppTier, readonly string[]> = {
  60: [
    "AF",
    "AO",
    "BD",
    "BF",
    "BI",
    "BJ",
    "CD",
    "DZ",
    "EG",
    "ET",
    "GH",
    "GM",
    "GN",
    "IN",
    "KG",
    "KH",
    "LA",
    "LK",
    "LR",
    "LY",
    "MG",
    "ML",
    "MM",
    "MW",
    "MZ",
    "NE",
    "NG",
    "NP",
    "PK",
    "RW",
    "SD",
    "SL",
    "SY",
    "TD",
    "TG",
    "TJ",
    "TN",
    "TZ",
    "UG",
    "UZ",
    "ZM",
  ],
  50: [
    "AM",
    "AR",
    "AZ",
    "BO",
    "BY",
    "CI",
    "CM",
    "CO",
    "GE",
    "GT",
    "HN",
    "ID",
    "IQ",
    "JO",
    "KE",
    "KZ",
    "LB",
    "MA",
    "MD",
    "MN",
    "NI",
    "PH",
    "PY",
    "SN",
    "TR",
    "UA",
    "VN",
    "ZW",
  ],
  40: [
    "AL",
    "BA",
    "BG",
    "BR",
    "BW",
    "CN",
    "DO",
    "EC",
    "MK",
    "MU",
    "MX",
    "MY",
    "NA",
    "PA",
    "PE",
    "RO",
    "RS",
    "SV",
    "TH",
    "TW",
    "ZA",
  ],
  30: [
    "CL",
    "CR",
    "CZ",
    "GR",
    "HR",
    "HU",
    "JP",
    "KR",
    "LT",
    "LV",
    "ME",
    "OM",
    "PL",
    "PT",
    "SA",
    "SK",
    "TT",
  ],
  20: ["BH", "CY", "EE", "ES", "IT", "MT", "SI", "UY"],
};

const TIER_BY_COUNTRY: Record<string, PppTier | undefined> = Object.fromEntries(
  PPP_TIERS.flatMap((tier) =>
    COUNTRIES_BY_TIER[tier].map((country) => [country, tier])
  )
);

export const pppTierFor = (
  country: string | null | undefined
): PppTier | null => {
  if (!country) {
    return null;
  }
  return TIER_BY_COUNTRY[country.toUpperCase()] ?? null;
};

export const discountedPriceCents = (tier: PppTier | null): number => {
  if (tier === null) {
    return BASE_PRICE_CENTS;
  }
  return Math.round((BASE_PRICE_CENTS * (100 - tier)) / 100);
};

export const formatUsd = (cents: number): string =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100);
