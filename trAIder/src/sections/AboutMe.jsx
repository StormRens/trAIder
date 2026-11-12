import './about.css';
import EyrieMark from '../EyrieMark.jsx';

// Edit these two lines to make the page yours.
const BUILDER_NAME = 'Storm Rens';
const BUILDER_NOTE = 'Eyrie started as a personal project: a way to watch the market and see the reasons behind every signal.';
const BUILDER_SIGNOFF = 'I hope you enjoy the expereince and if you have any feedback I would love to take a look at it, yours truly, Storm Rens'
const INGREDIENTS = [
  {
    name: 'Price vs 200-day average',
    text: 'A price above its long-run average usually means an uptrend is intact.',
  },
  {
    name: '50-day vs 200-day average',
    text: 'Is the medium-term trend pulling ahead of the long-term one, or falling behind it?',
  },
  {
    name: '3-month momentum',
    text: 'Has the price been rising or falling over the last three months?',
  },
  {
    name: 'RSI',
    text: 'A gauge of whether recent moves look stretched, in either direction.',
  },
];

export default function AboutMe() {
  return (
    <article className="page-section about">
      <header className="about-hero">
        <EyrieMark width={44} />
        <h2>About Eyrie</h2>
        <p className="about-def">
          <em>eyrie</em> (n.) A nest built high on a cliff, usually an eagle's. A place to watch from
          above.
        </p>
        <p className="about-lede">
          Eyrie gives you a calm view of the market. It reads price trends, shows what is pushing each
          signal up or down, and tells you how much to trust it.
        </p>
      </header>

      <section>
        <h3>How a signal is made</h3>
        <p>
          Every signal starts with four trend measurements. Each one is scored from -100 to +100, then
          blended into a single number. Eyrie shows you every ingredient, so you can see why it says
          buy, hold, or sell, and not only what.
        </p>
        <ul className="about-list">
          {INGREDIENTS.map((i) => (
            <li key={i.name}>
              <strong>{i.name}</strong>
              <span>{i.text}</span>
            </li>
          ))}
        </ul>
        <p>
          Confidence is a separate number. It rises when the four measurements agree, and it falls when
          they pull in different directions or the price is swinging a lot.
        </p>
      </section>

      <section>
        <h3>Where the AI comes in</h3>
        <p>
          Today, signals come from plain, transparent math, not a language model. The AI layer is
          next: reading news and world events and explaining, in plain English, how they could affect a
          stock or fund. When it arrives, it will show up as its own driver, so you can always tell what
          came from the math and what came from the model.
        </p>
      </section>

      <section className="about-limits">
        <h3>What Eyrie is not</h3>
        <ul>
          <li>
            <strong>Not financial advice.</strong> Eyrie is not a financial advisor, and nothing here
            is a recommendation to buy or sell.
          </li>
          <li>
            <strong>Not tested yet.</strong> The signals haven't been checked against history, so the
            confidence number is not a probability.
          </li>
          <li>
            <strong>Not the whole picture.</strong> News, economic events, and valuation aren't
            included yet.
          </li>
          <li>
            <strong>Not real time.</strong> Prices are daily, so Eyrie is for trends over weeks and
            months, not day trading.
          </li>
        </ul>
      </section>

      <section>
        <h3>Where the data comes from</h3>
        <p>
          Daily prices come from Twelve Data. The calculations run on Eyrie's own server, and your
          watchlist stays on this device.
        </p>
      </section>

      <section>
        <h3>Who built it</h3>
        <p>{BUILDER_NOTE}</p>
        <p className="about-sign">{BUILDER_SIGNOFF}</p>
      </section>

      {/* Sponsors: add a section here when there are any. */}
    </article>
  );
}