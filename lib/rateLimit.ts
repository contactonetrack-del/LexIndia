/**
 * lib/rateLimit.ts
 * 
 * Simple in-memory sliding-window rate limiter.
 * Production note: Replace with Redis-backed rate limiter (e.g., @upstash/ratelimit) for multi-instance deployments.
 */

interface RateLimitStore {
    count: number;
    resetAt: number;
}

const store = new Map<string, RateLimitStore>();

// Clean up expired entries every 5 minutes to prevent memory leak
if (typeof global !== 'undefined' && !(global as any).__rl_cleanup) {
    (global as any).__rl_cleanup = setInterval(() => {
        const now = Date.now();
        for (const [key, val] of store.entries()) {
            if (val.resetAt < now) store.delete(key);
        }
    }, 5 * 60 * 1000);
}

interface RateLimitOptions {
    /** Maximum number of requests allowed in the window */
    limit: number;
    /** Window duration in seconds */
    windowSecs: number;
}

interface RateLimitResult {
    success: boolean;
    remaining: number;
    resetAt: number; // Unix ms timestamp
}

/**
 * Check if a given key has exceeded the rate limit.
 * @param key  Unique identifier (e.g., IP address, user email)
 */
export function rateLimit(key: string, { limit, windowSecs }: RateLimitOptions): RateLimitResult {
    const now = Date.now();
    const windowMs = windowSecs * 1000;

    const entry = store.get(key);

    if (!entry || entry.resetAt < now) {
        // New window
        const resetAt = now + windowMs;
        store.set(key, { count: 1, resetAt });
        return { success: true, remaining: limit - 1, resetAt };
    }

    if (entry.count >= limit) {
        return { success: false, remaining: 0, resetAt: entry.resetAt };
    }

    entry.count += 1;
    return { success: true, remaining: limit - entry.count, resetAt: entry.resetAt };
}

/**
 * Get client IP from Next.js request headers (works behind Vercel/Nginx proxy).
 */
export function getClientIp(req: Request): string {
    const forwarded = req.headers.get('x-forwarded-for');
    if (forwarded) return forwarded.split(',')[0].trim();
    return req.headers.get('x-real-ip') ?? 'unknown';
}
