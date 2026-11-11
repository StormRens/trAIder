// Market data provider. Everything provider-specific lives in this file,
// so swapping Twelve Data for another source only means rewriting this one function.
// Returns bars ordered oldest -> newest: [{ date: 'YYYY-MM-DD', close: number, volume: number }]

const BASE_URL = 'https://api.twelvedata.com/time_series';

function httpError(message, status) {
  return Object.assign(new Error(message), { status });
}

export async function fetchDailyBars(ticker, outputsize = 300) {
  const apiKey = process.env.TWELVE_DATA_API_KEY;
  if (!apiKey) throw httpError('Server is missing TWELVE_DATA_API_KEY', 500);

  const url =
    `${BASE_URL}?symbol=${encodeURIComponent(ticker)}` +
    `&interval=1day&outputsize=${outputsize}&apikey=${apiKey}`;

  let res;
  try {
    res = await fetch(url);
  } catch {
    throw httpError('Could not reach the market data provider', 502);
  }
  if (!res.ok) throw httpError(`Market data provider returned HTTP ${res.status}`, 502);

  const json = await res.json();

  // Twelve Data reports many errors (bad symbol, rate limit) as HTTP 200 with a status field.
  if (json.status === 'error') {
    const status = json.code === 429 ? 429 : json.code === 400 || json.code === 404 ? 404 : 502;
    throw httpError(json.message || 'Market data provider error', status);
  }
  if (!Array.isArray(json.values) || json.values.length === 0) {
    throw httpError(`No price data found for ${ticker}`, 404);
  }

  // Provider returns newest first; indicators want oldest first.
  return json.values
    .map((v) => ({
      date: v.datetime,
      close: Number(v.close),
      volume: Number(v.volume) || 0,
    }))
    .filter((b) => Number.isFinite(b.close) && b.close > 0)
    .reverse();
}