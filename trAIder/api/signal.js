// GET /api/signal?ticker=VOO
// Vercel serverless function. API keys stay here, on the server, never in the React bundle.

import { fetchDailyBars } from './_lib/marketData.js';
import { computeTrendSignal } from './_lib/trendScore.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ticker = String(req.query.ticker || '').trim().toUpperCase();
  if (!/^[A-Z][A-Z0-9.\-]{0,9}$/.test(ticker)) {
    return res.status(400).json({ error: 'Provide a valid ticker, e.g. /api/signal?ticker=VOO' });
  }

  try {
    const bars = await fetchDailyBars(ticker);
    const signal = computeTrendSignal(ticker, bars);

    // Cache 15 min at the edge so refreshing the app doesn't burn your data-provider quota.
    res.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate=3600');
    return res.status(200).json(signal);
  } catch (err) {
    const status = err.status || 500;
    if (status === 500) console.error(err);
    return res.status(status).json({ error: err.message || 'Internal error' });
  }
}