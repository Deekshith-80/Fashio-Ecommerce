Here’s your `README.md` cleaned up so it’s concise, clear, and properly formatted:

---

# keepalive-server

Simple Node.js library to ping a URL at a fixed interval.

## Installation

```bash
npm i keepalive-server
```

## Usage

### ESM

```js
import { ping } from 'keepalive-server';

ping(60000, 'https://your-url.com'); // ping every 60 seconds
```

### CommonJS (with dynamic import for ESM support)

```js
(async () => {
  const { ping } = await import('keepalive-server');
  ping(60000, 'https://your-url.com');
})();
```

## API

`ping(intervalMs, url, timeoutMs?)`

- **intervalMs** — interval in milliseconds (e.g., `60000` for 1 min)
- **url** — target URL to ping
- **timeoutMs** _(optional)_ — per-request timeout in milliseconds (default: `10000`)

## Notes

- This library is ESM-only. In CommonJS projects, use the dynamic `import()` pattern above.
- Recommended to ping a lightweight `/health` endpoint instead of the full site.

---

For further issues, you can ping me on [@codeguyakash](https://x.com/codeguyakash)
