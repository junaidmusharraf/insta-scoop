
export interface InstagramMedia {
    id: string;
    caption?: string;
    media_type: string;
    media_url?: string;
    thumbnail_url?: string;
    timestamp: string;
    permalink?: string;
    like_count?: number;
    comments_count?: number;
    username?: string;
}

export interface CacheData {
    data: InstagramMedia[];
    timestamp: number;
}

export class CacheStrategy {
    getCache(cacheKey: string): Promise<CacheData | null>;
    setCache(cacheKey: string, data: CacheData): Promise<void>;
}

export class ServerCacheStrategy extends CacheStrategy {
    static cache: Map<string, CacheData>;
    getCache(cacheKey: string): Promise<CacheData | null>;
    setCache(cacheKey: string, data: CacheData): Promise<void>;
}

export class CacheStrategyFactory {
    static create(): CacheStrategy;
}

export interface InstagramMediaParams {
    accountId: string;
    accessToken: string;
    apiVersion?: string;
    maxPages?: number;
    cacheTTL?: number;
    cacheStrategy?: CacheStrategy;
    fetchImpl?: typeof fetch;
}

export function getInstagramMedia(
    params: InstagramMediaParams
): Promise<InstagramMedia[]>;
