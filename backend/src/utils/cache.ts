/**
 * Simple in-memory TTL cache for the backend.
 * Portable — works on any Node.js server (Render, Railway, Vercel, etc.)
 * No external dependency needed.
 */

interface CacheEntry<T> {
    data: T;
    expiresAt: number;
}

class SimpleCache {
    private store = new Map<string, CacheEntry<any>>();

    get<T>(key: string): T | null {
        const entry = this.store.get(key);
        if (!entry) return null;
        if (Date.now() > entry.expiresAt) {
            this.store.delete(key);
            return null;
        }
        return entry.data as T;
    }

    set<T>(key: string, data: T, ttlSeconds: number): void {
        this.store.set(key, {
            data,
            expiresAt: Date.now() + ttlSeconds * 1000,
        });
    }

    delete(key: string): void {
        this.store.delete(key);
    }

    /** Invalidate all keys that start with a given prefix */
    invalidatePrefix(prefix: string): void {
        for (const key of this.store.keys()) {
            if (key.startsWith(prefix)) this.store.delete(key);
        }
    }
}

// Singleton — shared across all requests in the same process
export const cache = new SimpleCache();
