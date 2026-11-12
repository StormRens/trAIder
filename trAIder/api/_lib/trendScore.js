// Turns price bars into a trend score (-100..+100), an action, and a confidence value.
//
// IMPORTANT: confidence here is a heuristic, not a probability. It is NOT calibrated
// until you backtest it (see `calibrated: false` in the output). Treat it as
// "how much the trend indicators agree", nothing more.

import { sma, rsi, rateOfChange, annualizedVolatility } from './indicators.js';

const MIN_BARS = 210;        // need 200 for the long average, plus a little headroom
const MAX_CONFIDENCE = 85;   // never imply certainty
const ACTION_THRESHOLD = 25; // |score| must reach this to say buy or sell

const WEIGHTS = { vs200: 0.3, cross: 0.2, momentum: 0.3, rsi: 0.2 };

const clamp = (x, lo = -100, hi = 100) => Math.max(lo, Math.min(hi, x));
const round = (x, d = 1) => Math.round(x * 10 ** d) / 10 ** d;
const pct = (x) => `${x >= 0 ? '+' : ''}${(x * 100).toFixed(1)}%`;

// RSI reading: 50 is neutral, rising RSI is bullish up to ~70, then overbought cools the score.
function rsiScore(r) {
  if (r >= 70) return clamp(40 - (r - 70) * 4);
  if (r <= 30) return clamp(-40 + (30 - r) * 4);
  return (r - 50) * 2;
}

export function computeTrendSignal(ticker, bars) {
  if (!Array.isArray(bars) || bars.length < MIN_BARS) {
    throw Object.assign(
      new Error(`Need at least ${MIN_BARS} daily bars for ${ticker}, got ${bars?.length ?? 0}`),
      { status: 422 }
    );
  }

  const closes = bars.map((b) => b.close);
  const last = closes[closes.length - 1];
  const sma50 = sma(closes, 50);
  const sma200 = sma(closes, 200);
  const rsi14 = rsi(closes, 14);
  const roc63 = rateOfChange(closes, 63); // ~3 months
  const vol = annualizedVolatility(closes, 30);

  const vs200 = last / sma200 - 1;
  const cross = sma50 / sma200 - 1;

  const components = [
    {
      key: 'vs200',
      label: 'Price vs 200-day average',
      score: clamp((vs200 / 0.1) * 100), // +10% above the average = max bullish
      note: `Price is ${pct(vs200)} versus the 200-day average`,
    },
    {
      key: 'cross',
      label: '50-day vs 200-day average',
      score: clamp((cross / 0.05) * 100),
      note: `50-day average is ${pct(cross)} versus the 200-day average`,
    },
    {
      key: 'momentum',
      label: '3-month momentum',
      score: clamp((roc63 / 0.12) * 100),
      note: `Price changed ${pct(roc63)} over the last ~63 trading days`,
    },
    {
      key: 'rsi',
      label: 'RSI (14)',
      score: rsiScore(rsi14),
      note:
        rsi14 >= 70 ? `RSI ${rsi14.toFixed(0)}: overbought, trend may be stretched`
        : rsi14 <= 30 ? `RSI ${rsi14.toFixed(0)}: oversold, selling may be stretched`
        : `RSI ${rsi14.toFixed(0)}: no extreme reading`,
    },
  ].map((c) => ({
    ...c,
    weight: WEIGHTS[c.key],
    contribution: c.score * WEIGHTS[c.key],
  }));

  const score = components.reduce((s, c) => s + c.contribution, 0);

  // Agreement: share of (meaningful) weight pointing the same way as the overall score.
  const direction = Math.sign(score);
  const active = components.filter((c) => Math.abs(c.score) >= 10);
  const activeWeight = active.reduce((s, c) => s + c.weight, 0);
  const agreeingWeight = active
    .filter((c) => Math.sign(c.score) === direction)
    .reduce((s, c) => s + c.weight, 0);
  const agreement = direction === 0 || activeWeight === 0 ? 0 : agreeingWeight / activeWeight;

  // Confidence = signal strength (0-50) + indicator agreement (0-35) - volatility penalty (0-15)
  const volPenalty = vol == null ? 0 : clamp((vol - 0.2) / 0.3, 0, 1) * 15;
  const confidence = clamp(
    (Math.abs(score) / 100) * 50 + agreement * 35 - volPenalty,
    0,
    MAX_CONFIDENCE
  );

  const action =
    score >= ACTION_THRESHOLD ? 'buy' : score <= -ACTION_THRESHOLD ? 'sell' : 'hold';

  const risks = ['Trend-only signal: news, macro events and valuation are not included yet'];
  if (rsi14 >= 70) risks.push('Overbought: RSI above 70, pullbacks are more likely');
  if (rsi14 <= 30) risks.push('Oversold: RSI below 30, but falling prices can keep falling');
  if (vol != null && vol > 0.3) risks.push(`High volatility (${(vol * 100).toFixed(0)}% annualized)`);

  const upper = Math.max(sma50, sma200);
  const lower = Math.min(sma50, sma200);
  const wouldChange =
    action === 'buy'
      ? [`Close below the 200-day average ($${sma200.toFixed(2)})`, '50-day average crossing below the 200-day']
      : action === 'sell'
      ? [`Close back above the 200-day average ($${sma200.toFixed(2)})`, '50-day average crossing above the 200-day']
      : [
          `Close above $${upper.toFixed(2)} (both averages) with rising momentum`,
          `Close below $${lower.toFixed(2)} (both averages) with falling momentum`,
        ];

  const prev = closes[closes.length - 2];

  return {
    ticker,
    action,
    score: round(score),
    confidence: Math.round(confidence),
    calibrated: false,
    horizon: '1-6 months',
    drivers: components.map((c) => ({
      type: 'trend',
      name: c.label,
      effect: round(c.contribution),
      note: c.note,
    })),
    risks,
    would_change_if: wouldChange,
    quote: {
      price: round(last, 2),
      change: round(last - prev, 2),
      changePercent: round((last / prev - 1) * 100, 2),
      trend: closes.slice(-30).map((c) => round(c, 2)),
    },
    metrics: {
      close: round(last, 2),
      sma50: round(sma50, 2),
      sma200: round(sma200, 2),
      rsi14: round(rsi14),
      roc63: round(roc63, 4),
      annualizedVolatility: vol == null ? null : round(vol, 3),
    },
    data_as_of: bars[bars.length - 1].date,
    generated_at: new Date().toISOString(),
  };
}
