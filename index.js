
const API_VERSION = "v27.0";
const CACHE_TTL = 60 * 60 * 1000;

const MEDIA_FIELDS = [
    "id",
    "caption",
    "media_type",
    "media_url",
    "thumbnail_url",
    "timestamp",
    "permalink",
    "like_count",
    "comments_count",
    "username"
].join(",");

// Base cache strategy
export class CacheStrategy {
    async getCache() {
        throw new Error("getCache method must be implemented");
    }

    async setCache() {
        throw new Error("setCache method must be implemented");
    }
}

// Server-side cache shared between instances
export class ServerCacheStrategy extends CacheStrategy {
    static cache = new Map();

    async getCache(cacheKey) {
        return ServerCacheStrategy.cache.get(cacheKey) || null;
    }

    async setCache(cacheKey, data) {
        ServerCacheStrategy.cache.set(cacheKey, data);
    }
}

// Cache factory
export class CacheStrategyFactory {
    static create() {
        return new ServerCacheStrategy();
    }
}

// Main Instagram media function
export async function getInstagramMedia({
    accountId,
    accessToken,
    apiVersion = API_VERSION,
    maxPages = 10,
    cacheTTL = CACHE_TTL,
    cacheStrategy = CacheStrategyFactory.create(),
    fetchImpl = globalThis.fetch
}) {
    if (!accountId || !accessToken) {
        throw new Error(
            "Instagram account ID and access token are required."
        );
    }

    if (typeof fetchImpl !== "function") {
        throw new Error("A fetch implementation is required.");
    }

    if (!Number.isInteger(maxPages) || maxPages < 1) {
        throw new Error("maxPages must be a positive integer.");
    }

    const cacheKey = `instagram_media_${apiVersion}_${accountId}`;
    const now = Date.now();

    // Check cache
    const cached = await cacheStrategy.getCache(cacheKey);

    if (
        cached &&
        now - cached.timestamp < cacheTTL
    ) {
        return cached.data;
    }

    // Prepare API request
    const url = new URL(
        `https://graph.facebook.com/${apiVersion}/${accountId}/media`
    );

    url.searchParams.set("fields", MEDIA_FIELDS);
    url.searchParams.set("access_token", accessToken);

    const media = [];
    let nextUrl = url.toString();

    try {
        // Retrieve media and follow pagination
        for (let page = 0; nextUrl && page < maxPages; page++) {
            const response = await fetchImpl(nextUrl);

            const result = await response.json();

            if (!response.ok || result.error) {
                throw new Error(
                    result.error?.message ||
                    `Instagram API request failed with status ${response.status}`
                );
            }

            if (!Array.isArray(result.data)) {
                throw new Error(
                    "Unexpected Instagram API response format."
                );
            }

            media.push(...result.data);

            nextUrl = result.paging?.next || null;
        }

        // Save results in cache
        await cacheStrategy.setCache(cacheKey, {
            data: media,
            timestamp: Date.now()
        });

        return media;

    } catch (error) {
        console.error("Instagram API error:", error.message);
        throw error;
    }
}
