
# Insta Scoop

A lightweight Node.js package for retrieving Instagram media using the Instagram Graph API.

## Features

- Retrieve Instagram posts, images, videos and reels.
- Support for paginated media responses.
- Built-in in-memory caching.
- Configurable cache expiration.
- Customizable pagination limit.
- Error handling for API requests.
- TypeScript declarations.

## Requirements

- Node.js 18 or newer.
- An Instagram Professional account (Business or Creator).
- A Facebook Developer app configured for Instagram API with Facebook Login.
- An Instagram account linked to a Facebook Page.
- A valid access token with the required permissions.

## Installation

```bash
npm install insta-scoop
```

## Configuration

Obtain your Instagram account ID and access token through the Meta Developer dashboard.

Keep your credentials in environment variables.

PowerShell:

```powershell
$env:INSTAGRAM_ACCOUNT_ID="your-account-id"
$env:INSTAGRAM_ACCESS_TOKEN="your-access-token"
```

## Usage

```javascript
import { getInstagramMedia } from "insta-scoop";

const accountId = process.env.INSTAGRAM_ACCOUNT_ID;
const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;

async function getMedia() {
    try {
        const media = await getInstagramMedia({
            accountId,
            accessToken
        });

        console.log(media);

    } catch (error) {
        console.error(error.message);
    }
}

getMedia();
```

## Pagination

The package follows Instagram's pagination links.

You can limit the number of pages:

```javascript
const media = await getInstagramMedia({
    accountId,
    accessToken,
    maxPages: 5
});
```

The default limit is 10 pages.

## Caching

Insta Scoop includes an in-memory server cache.

Cached results are reused for one hour by default.

You can customize the cache duration:

```javascript
const media = await getInstagramMedia({
    accountId,
    accessToken,
    cacheTTL: 30 * 60 * 1000
});
```

This example changes the cache duration to 30 minutes.

The cache is stored in application memory and is not shared between separate server processes. It is lost when the process restarts.

## Testing

Run the included mock tests:

```bash
npm test
```

The tests simulate Instagram API responses and do not require real Instagram credentials.

## Security

- Never expose your access token in frontend code.
- Never commit credentials to GitHub.
- Use environment variables or a secure secrets manager.
- Keep your access tokens private.

## License

MIT. See the LICENSE file for details.

## Acknowledgements

This project is based on the original Insta Scoop package by Eren Aygün.

This modified version includes additional improvements and changes.
