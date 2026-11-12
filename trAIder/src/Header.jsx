import { useState } from 'react';
import SidePanel from './SidePanel.jsx';
import EyrieMark from './EyrieMark.jsx';

function Header({ onNavigate, active }) {
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  return (
    <>
      <header className="site-header">
        <button type="button" className="icon-btn" aria-label="Open menu" onClick={() => setIsPanelOpen(true)}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>

        <h1 className="wordmark">
          <EyrieMark />
          Eyrie
        </h1>

        <button type="button" className="icon-btn" aria-label="Profile">
          <span className="avatar">U</span>
        </button>
      </header>

      <SidePanel isOpen={isPanelOpen} onClose={() => setIsPanelOpen(false)} onSelect={onNavigate} active={active} />
    </>
  );
}

export default Header;