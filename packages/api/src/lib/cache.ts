import type { Bindings } from "./config";

/**
 * Simple hashing for cache keys using the Web Crypto API available in Workers.
 */
async function hashInput(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Attempt to retrieve a cached MasterPortfolio JSON from Cloudflare KV.
 * Returns null if no cache binding exists or on cache miss.
 */
export async function getCached(
  env: Bindings,
  inputKey: string
): Promise<string | null> {
  if (!env.PORTFOLIO_CACHE) return null;

  const hash = await hashInput(inputKey);
  return env.PORTFOLIO_CACHE.get(`portfolio:${hash}`);
}

/**
 * Store a generated MasterPortfolio JSON in Cloudflare KV.
 * TTL: 7 days (604800 seconds).
 */
export async function setCached(
  env: Bindings,
  inputKey: string,
  value: string
): Promise<void> {
  if (!env.PORTFOLIO_CACHE) return;

  const hash = await hashInput(inputKey);
  await env.PORTFOLIO_CACHE.put(`portfolio:${hash}`, value, {
    expirationTtl: 604800,
  });
}
