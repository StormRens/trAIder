import './about.css';
import './howto.css';
import SignalCard from '../SignalCard.jsx';

// A made-up card so people can practice reading one. The numbers are consistent with how
// the real scoring works, but nothing here is live data.
const SAMPLE = {
  status: 'ok',
  error: null,
  data: {
    ticker: 'SAMPLE',
    action: 'hold',
    confidence: 20,
    calibrated: false,
    horizon: '1-6 months',
    quote: { price: 100, change: 0.4, changePercent: 0.4, trend: [] },
    drivers: [
      { name: 'Price vs 200-day average', effect: 9, note: 'Price is +3.0% versus the 200-day average' },
      { name: '50-day vs 200-day average', effect: 8, note: '50-day average is +2.0% versus the 200-day average' },
      { name: '3-month momentum', effect: -9, note: 'Price changed -3.6% over the last ~63 trading days' },
      { name: 'RSI (14)', effect: -4, note: 'RSI 40: no extreme reading' },
    ],
    risks: ['Trend-only signal: news, macro events and valuation are not included yet'],
    would_change_if: [
      'Close above $104.00 (both averages) with rising momentum',
      'Close below $97.00 (both averages) with falling momentum',
    ],
    data_as_of: 'example data',
  },
};

const GLOSSARY = [
  ['200-day average', 'The average closing price over the last 200 trading days, about ten months. It is a common line between a long-term uptrend and downtrend.'],
  ['50-day average', 'The same idea over about two and a half months. When it sits above the 200-day average, the medium-term trend is ahead of the long-term one.'],
  ['Momentum', 'How much the price has changed over the last three months.'],
  ['RSI', 'A score from 0 to 100 for how stretched recent moves look. Above 70 is often called overbought, and below 30 oversold.'],
  ['Volatility', 'How much the price swings from day to day. Higher volatility makes any signal less dependable, so Eyrie lowers its confidence.'],
];

export default function HowToUse() {
  return (
    <article className="page-section about">
      <header className="about-hero">
        <h2>How to use Eyrie</h2>
        <p className="about-lede">
          Eyrie shows where a stock or fund's price trend stands today and why. Here is how to read
          what it shows you.
        </p>
      </header>

      <section>
        <h3>The short version</h3>
        <ol className="steps">
          <li>Search for a ticker, or open one from your watchlist.</li>
          <li>Read the label and the bars to see which way the trend leans, and why.</li>
          <li>Open "Details and risks" before you decide anything.</li>
        </ol>
        <p>
          Eyrie doesn't place trades or connect to bank accounts. You make the decision, and you act on
          it in your own brokerage.
        </p>
      </section>

      <section>
        <h3>Reading a signal card</h3>
        <p>
          This is a made-up example, so you can practice. Try opening "Details and risks" on it.
        </p>
        <div className="howto-sample">
          <p className="howto-sample-label">Example card, not live data</p>
          <SignalCard ticker="SAMPLE" entry={SAMPLE} />
        </div>

        <dl className="legend">
          <div>
            <dt>The label: Buy, Hold, or Sell</dt>
            <dd>
              Buy means the trend indicators lean clearly upward. Sell means they lean clearly
              downward. Hold means there is no strong trend either way, or the indicators disagree, as
              they do in the example. Hold is a normal result, not a failure.
            </dd>
          </div>
          <div>
            <dt>Confidence</dt>
            <dd>
              How much the indicators agree with each other, adjusted down when the price is swinging a
              lot. It never goes above 85, because no signal is certain. It is not a probability, since
              Eyrie hasn't been checked against history yet.
            </dd>
          </div>
          <div>
            <dt>The bars</dt>
            <dd>
              Each bar is one ingredient. The center line is zero. A green bar reaching right pushes
              the signal toward buy, and a red bar reaching left pushes it toward sell. The longer the
              bar, the stronger the push. In the example, the averages push up while momentum and RSI
              push down, so they roughly cancel and the label is Hold.
            </dd>
          </div>
          <div>
            <dt>Details and risks</dt>
            <dd>
              Tap it to see each ingredient explained in words, the risks to keep in mind, and the
              price levels that would change the picture.
            </dd>
          </div>
        </dl>
      </section>

      <section>
        <h3>Searching for a stock or fund</h3>
        <ol className="steps">
          <li>Type the ticker symbol into the search box, for example NVDA, VOO, or BRK.B.</li>
          <li>Press Search. The card appears right below the box.</li>
          <li>Choose "Add to watchlist" to keep it, or Clear to dismiss it.</li>
        </ol>
        <p>
          Search works with ticker symbols only, not company names. If a symbol isn't found, check the
          spelling. Very new listings are also left out, because there isn't enough price history to
          calculate a trend.
        </p>
      </section>

      <section>
        <h3>Your watchlist</h3>
        <p>
          Your watchlist holds up to eight tickers and appears below the search box. The scrolling
          bar at the top of the screen shows the price and daily change for each one. Use Remove on a
          card to take it off the list.
        </p>
        <p>
          The list is saved on this device only. If you open Eyrie on another phone or browser, it
          starts with the default list.
        </p>
      </section>

      <section>
        <h3>Prices and refreshing</h3>
        <p>
          Prices are daily, and each card shows the date of the latest one. Eyrie is for watching
          trends over weeks and months, not for trading within the day.
        </p>
        <p>
          Eyrie reuses recent results for up to 15 minutes, because the data source limits how often
          it can be asked. Refresh fetches new data for your whole watchlist. If a card says the rate
          limit was reached, wait a minute and try again.
        </p>
      </section>

      <section className="about-limits">
        <h3>Using signals sensibly</h3>
        <ul>
          <li>
            When the bars point in opposite directions, take that seriously. Mixed signals are
            information too.
          </li>
          <li>Read the risks before the label. They say what the numbers can't see.</li>
          <li>
            Treat a signal as one input among several, alongside your own research and what you can
            afford to risk.
          </li>
          <li>
            Eyrie is not a financial advisor, and nothing in it is a recommendation to buy or sell.
          </li>
        </ul>
      </section>

      <section>
        <h3>Terms you will see</h3>
        <dl className="glossary">
          {GLOSSARY.map(([term, meaning]) => (
            <div key={term}>
              <dt>{term}</dt>
              <dd>{meaning}</dd>
            </div>
          ))}
        </dl>
      </section>
    </article>
  );
}