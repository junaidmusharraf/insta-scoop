
import {
    getInstagramMedia,
    ServerCacheStrategy
} from "./index.js";

async function testInstagram() {
    console.log("Starting Instagram package tests...\n");

    let requestCount = 0;

    const mockFetch = async (url) => {
        requestCount++;

        if (url.includes("page=2")) {
            return {
                ok: true,
                status: 200,
                json: async () => ({
                    data: [
                        {
                            id: "456",
                            caption: "Second Instagram post",
                            media_type: "IMAGE",
                            timestamp: new Date().toISOString()
                        }
                    ]
                })
            };
        }

        return {
            ok: true,
            status: 200,
            json: async () => ({
                data: [
                    {
                        id: "123",
                        caption: "First Instagram post",
                        media_type: "IMAGE",
                        timestamp: new Date().toISOString()
                    }
                ],
                paging: {
                    next: "https://mock-instagram-api.com/media?page=2"
                }
            })
        };
    };

    // Start with a clean cache
    ServerCacheStrategy.cache.clear();

    const options = {
        accountId: "123456",
        accessToken: "mock_token",
        fetchImpl: mockFetch
    };

    try {
        // First request
        const firstResult = await getInstagramMedia(options);

        console.log("First request:");
        console.log(JSON.stringify(firstResult, null, 2));

        console.log("\nNumber of API requests:", requestCount);

        // Second request should use cache
        const secondResult = await getInstagramMedia(options);

        console.log("\nSecond request:");
        console.log("Returned media:", secondResult.length);
        console.log("Number of API requests:", requestCount);

        if (
            firstResult.length === 2 &&
            secondResult.length === 2 &&
            requestCount === 2
        ) {
            console.log("\nAll tests passed!");
        } else {
            throw new Error("Test failed.");
        }

    } catch (error) {
        console.error("\nTest failed:", error.message);
        process.exitCode = 1;
    }
}

testInstagram();
