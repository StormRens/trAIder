import { useState } from 'react';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import StockTicker from './StockTicker.jsx';
import AboutMe from './sections/AboutMe.jsx';
import Signals from './sections/Signals.jsx';
import HowToUse from './sections/HowToUse.jsx';
import { NAV_ITEMS } from './navItems.js';
import { useSignals } from './useSignals.js';
import { useWatchlist } from './useWatchlist.js';
import './signals.css';

function ComingSoon({ label }) {
  return (
    <section className="page-section">
      <h2>{label}</h2>
      <p className="updated">This section isn't built yet.</p>
    </section>
  );
}

function App() {
  const [active, setActive] = useState('signals');
  const { watchlist, add, remove, isFull } = useWatchlist();
  const { tickers, entries, quotes, reload, updatedAt, loading, failedAll } = useSignals(watchlist);

  const renderSection = () => {
    switch (active) {
      case 'signals':
        return (
          <Signals
            tickers={tickers}
            entries={entries}
            onReload={reload}
            updatedAt={updatedAt}
            loading={loading}
            failedAll={failedAll}
            onAdd={add}
            onRemove={remove}
            isFull={isFull}
          />
        );
      case 'about':
        return <AboutMe />;
      case 'howto':
        return <HowToUse />;
      default:
        return <ComingSoon label={NAV_ITEMS.find((n) => n.key === active)?.label} />;
    }
  };

  return (
    <div className="app">
      <Header onNavigate={setActive} active={active} />
      <StockTicker quotes={quotes} loading={loading} />
      <main className="content">{renderSection()}</main>
      <Footer />
    </div>
  );
}

export default App;