import { NAV_ITEMS } from './navItems.js';
import EyrieMark from './EyrieMark.jsx';

function SidePanel({ isOpen, onClose, onSelect, active }) {
  return (
    <>
      <aside className={`side-panel ${isOpen ? 'open' : ''}`} aria-hidden={!isOpen}>
        <div className="panel-top">
          <span className="wordmark">
            <EyrieMark width={22} />
            Eyrie
          </span>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close menu">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <nav className="panel-nav">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              type="button"
              className={`panel-btn ${active === item.key ? 'active' : ''}`}
              onClick={() => {
                onSelect(item.key);
                onClose();
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Profile placeholder, to be connected to real accounts later */}
        <div className="panel-profile">
          <span className="avatar">U</span>
          <div className="profile-info">
            <div className="profile-name">Username</div>
            <div className="profile-email">user@example.com</div>
          </div>
        </div>
      </aside>

      {isOpen && <div className="overlay" onClick={onClose}></div>}
    </>
  );
}

export default SidePanel;