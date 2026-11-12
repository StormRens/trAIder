// The browser only ever talks to our own /api routes. API keys stay on the server.
// A short in-memory cache stops duplicate requests (React StrictMode runs effects twice in dev,
// which would otherwise burn the free plan's 8 requests/minute).

const CACHE_MS = 60_000;
const cache = new Map(); // ticker -> { ts, promise }

export function fetchSignal(ticker, { force = false } = {}) {
  const hit = cache.get(ticker);
  if (!force && hit && Date.now() - hit.ts < CACHE_MS) return hit.promise;

  const promise = fetch(`/api/signal?ticker=${encodeURIComponent(ticker)}`)
    .then(async (res) => {
      const body = await res.json().catch(() => null);
      if (!body) {
        throw new Error('API not reachable. Start the app with npm run dev:api, not npm run dev.');
      }
      if (!res.ok) throw new Error(body.error || `Request failed (${res.status})`);
      return body;
    })
    .catch((err) => {
      cache.delete(ticker);
      throw err;
    });

  cache.set(ticker, { ts: Date.now(), promise });
  return promise;
}
