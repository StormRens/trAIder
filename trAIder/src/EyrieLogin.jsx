import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EyrieMark from './EyrieMark.jsx';
import './login.css';

// NOTE: this screen does not check credentials yet. Any input continues to /app.
export default function EyrieLogin() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('signin');
  const [showPass, setShowPass] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/app');
  };

  return (
    <div className="login">
      <div className="login-band">
        <h1 className="login-word">
          <EyrieMark width={34} />
          Eyrie
        </h1>
        <p className="login-tag">Market signals, explained.</p>
      </div>

      <div className="login-card">
        <div className="tabs" role="tablist">
          <button type="button" role="tab" aria-selected={tab === 'signin'} className={`tab ${tab === 'signin' ? 'on' : ''}`} onClick={() => setTab('signin')}>
            Sign in
          </button>
          <button type="button" role="tab" aria-selected={tab === 'register'} className={`tab ${tab === 'register' ? 'on' : ''}`} onClick={() => setTab('register')}>
            Create account
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {tab === 'register' && (
            <label className="field">
              <span>Username</span>
              <input type="text" autoComplete="username" placeholder="storm" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </label>
          )}
          <label className="field">
            <span>Email</span>
            <input type="email" autoComplete="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label className="field">
            <span>Password</span>
            <div className="pw">
              <input
                type={showPass ? 'text' : 'password'}
                autoComplete={tab === 'signin' ? 'current-password' : 'new-password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="button" onClick={() => setShowPass(!showPass)}>
                {showPass ? 'Hide' : 'Show'}
              </button>
            </div>
          </label>
          <button type="submit" className="primary-btn">
            {tab === 'signin' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <p className="login-note">Market data is for information only. Eyrie does not give financial advice.</p>
      </div>
    </div>
  );
}