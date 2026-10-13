import { createRateLimiter } from "@kholil/shared";

/**
 * Pembatas laju website. Memakai Upstash Redis bila UPSTASH_REDIS_REST_URL dan
 * UPSTASH_REDIS_REST_TOKEN diatur (disarankan di Vercel); selain itu in-memory per instance.
 */
const limiter = createRateLimiter({ prefix: "brand" });
export const rateLimit = limiter.rateLimit;
export const resetRateLimits = limiter.reset;
