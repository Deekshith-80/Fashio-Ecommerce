import fetch from 'node-fetch';

/**
 * Start pinging a URL at the specified interval.
 * @param {number} intervalMs - Interval in milliseconds (e.g., 60000 for 1 minute).
 * @param {string} url - The URL to ping.
 * @param {number} timeoutMs - Timeout in milliseconds per request (default 10000ms).
 */
export function ping(intervalMs, url, timeoutMs = 10000) {
  if (!intervalMs || typeof intervalMs !== 'number') {
    throw new Error('First argument (intervalMs) must be a number in ms.');
  }
  if (!url || typeof url !== 'string') {
    throw new Error('Second argument (url) must be a valid URL string.');
  }

  async function pingOnce() {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const res = await fetch(url, {
        method: 'GET',
        signal: controller.signal,
        headers: { 'User-Agent': 'keepalive-cli/1.0' },
      });
      console.log(
        `[${new Date().toISOString()}] ping -> ${res.status} ${res.statusText}`
      );
    } catch (err) {
      console.error(
        `[${new Date().toISOString()}] ping FAILED -> ${err.name}: ${err.message
        }`
      );
    } finally {
      clearTimeout(t);
    }
  }

  (async function tick() {
    await pingOnce();
    setTimeout(tick, intervalMs);
  })();
}
