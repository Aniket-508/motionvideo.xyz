import { env } from "cloudflare:workers";

// ISO 3166-1 alpha-2 country of the visitor, or null when unknown.
// Cloudflare sets `request.cf.country` on every request (and the
// `cf-ipcountry` header when IP geolocation is enabled on the zone).
export const requestCountry = (request: Request): string | null => {
  if (import.meta.env.DEV && env.DEV_COUNTRY) {
    return env.DEV_COUNTRY.toUpperCase();
  }

  const country =
    // SAFETY: Cloudflare sets `cf.country` to an ISO alpha-2 code string.
    (request.cf?.country as string | undefined) ??
    request.headers.get("cf-ipcountry");
  // "XX" = unknown, "T1" = Tor.
  if (!country || country === "XX" || country === "T1") {
    return null;
  }
  return country.toUpperCase();
};
