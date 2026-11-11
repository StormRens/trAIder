//We are going to build the login for the start.
import { useState, useEffect, useRef } from "react";

const CANDLESTICK_DATA = [
  { o: 60, h: 75, l: 55, c: 70 },
  { o: 70, h: 80, l: 65, c: 68 },
  { o: 68, h: 85, l: 64, c: 82 },
  { o: 82, h: 90, l: 78, c: 79 },
  { o: 79, h: 88, l: 70, c: 85 },
  { o: 85, h: 95, l: 80, c: 88 },
  { o: 88, h: 92, l: 75, c: 77 },
  { o: 77, h: 83, l: 68, c: 72 },
  { o: 72, h: 78, l: 60, c: 65 },
  { o: 65, h: 74, l: 58, c: 71 },
  { o: 71, h: 84, l: 67, c: 80 },
  { o: 80, h: 91, l: 76, c: 89 },
  { o: 89, h: 98, l: 84, c: 93 },
  { o: 93, h: 100, l: 85, c: 87 },
  { o: 87, h: 96, l: 80, c: 94 },
];

function CandlestickChart() {
  const W = 600, H = 160, PAD = 10;
  const candles = CANDLESTICK_DATA;
  const allVals = candles.flatMap(c => [c.h, c.l]);
  const minV = Math.min(...allVals) - 5;
  const maxV = Math.max(...allVals) + 5;
  const range = maxV - minV;
  const toY = v => H - PAD - ((v - minV) / range) * (H - PAD * 2);
  const cw = 28, gap = 12;
  const totalW = candles.length * (cw + gap);
  const startX = (W - totalW) / 2;

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a0f1e" stopOpacity="0" />
          <stop offset="100%" stopColor="#0a0f1e" stopOpacity="0.8" />
        </linearGradient>
        {[0.2, 0.4, 0.6, 0.8].map((v, i) => (
          <line key={i} x1={PAD} y1={toY(minV + range * v)} x2={W - PAD} y2={toY(minV + range * v)} stroke="#1e2d4a" strokeWidth="0.5" strokeDasharray="4 4" />
        ))}
      </defs>
      {[0.2, 0.4, 0.6, 0.8].map((v, i) => (
        <line key={i} x1={PAD} y1={toY(minV + range * v)} x2={W - PAD} y2={toY(minV + range * v)} stroke="#1e2d4a" strokeWidth="0.5" strokeDasharray="4 4" />
      ))}
      {candles.map((c, i) => {
        const x = startX + i * (cw + gap);
        const isUp = c.c >= c.o;
        const color = isUp ? "#00e5a0" : "#ff4d6d";
        const glow = isUp ? "rgba(0,229,160,0.3)" : "rgba(255,77,109,0.3)";
        const bodyTop = toY(Math.max(c.o, c.c));
        const bodyBot = toY(Math.min(c.o, c.c));
        const bodyH = Math.max(2, bodyBot - bodyTop);
        const cx = x + cw / 2;
        return (
          <g key={i} style={{ filter: `drop-shadow(0 0 4px ${glow})` }}>
            <line x1={cx} y1={toY(c.h)} x2={cx} y2={toY(c.l)} stroke={color} strokeWidth="1.5" />
            <rect x={x} y={bodyTop} width={cw} height={bodyH} rx="2" fill={isUp ? color : "transparent"} stroke={color} strokeWidth="1.5" fillOpacity={isUp ? 0.85 : 0} />
            {!isUp && <rect x={x} y={bodyTop} width={cw} height={bodyH} rx="2" fill={color} fillOpacity="0.15" />}
          </g>
        );
      })}
      <rect x={0} y={0} width={W} height={H} fill="url(#bgGrad)" />
    </svg>
  );
}

function TickerTape() {
  const tickers = [
    { sym: "AAPL", val: "+2.34%", up: true }, { sym: "TSLA", val: "-1.12%", up: false },
    { sym: "NVDA", val: "+5.67%", up: true }, { sym: "MSFT", val: "+0.89%", up: true },
    { sym: "AMZN", val: "-0.45%", up: false }, { sym: "META", val: "+3.21%", up: true },
    { sym: "GOOGL", val: "+1.55%", up: true }, { sym: "SPY", val: "+0.72%", up: true },
    { sym: "BTC", val: "+4.88%", up: true }, { sym: "ETH", val: "-2.03%", up: false },
  ];
  const repeated = [...tickers, ...tickers];
  return (
    <div style={{ overflow: "hidden", borderTop: "1px solid rgba(0,229,160,0.15)", borderBottom: "1px solid rgba(0,229,160,0.15)", padding: "6px 0", background: "rgba(0,229,160,0.03)" }}>
      <div style={{ display: "flex", gap: "40px", animation: "ticker 22s linear infinite", whiteSpace: "nowrap" }}>
        {repeated.map((t, i) => (
          <span key={i} style={{ fontSize: "11px", fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "0.08em", color: t.up ? "#00e5a0" : "#ff4d6d", opacity: 0.8 }}>
            {t.sym} <span style={{ opacity: 0.6 }}>{t.val}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function GlowOrb({ x, y, color, size }) {
  return (
    <div style={{
      position: "absolute", left: x, top: y, width: size, height: size,
      borderRadius: "50%", background: color, filter: "blur(80px)", opacity: 0.18, pointerEvents: "none",
    }} />
  );
}

export default function TraiderLogin() {
  const [tab, setTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [focused, setFocused] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setTimeout(() => setMounted(true), 80); }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setSubmitted(true); }, 1800);
  };

  const inputStyle = (name) => ({
    width: "100%",
    background: focused === name ? "rgba(0,229,160,0.06)" : "rgba(255,255,255,0.03)",
    border: `1px solid ${focused === name ? "rgba(0,229,160,0.5)" : "rgba(255,255,255,0.08)"}`,
    borderRadius: "10px",
    padding: "13px 16px",
    color: "#e8f0fe",
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: "13px",
    outline: "none",
    transition: "all 0.25s ease",
    boxSizing: "border-box",
    boxShadow: focused === name ? "0 0 0 3px rgba(0,229,160,0.08), inset 0 1px 0 rgba(255,255,255,0.05)" : "inset 0 1px 0 rgba(255,255,255,0.03)",
    letterSpacing: "0.02em",
  });

  const labelStyle = {
    display: "block",
    fontSize: "10px",
    fontFamily: "'IBM Plex Mono', monospace",
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.35)",
    marginBottom: "7px",
  };

  return (
    <div style={{
      minHeight: "100vh", width: "100%", background: "#060b17",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'IBM Plex Mono', monospace", position: "relative", overflow: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600&family=Syne:wght@700;800&display=swap');
        * { box-sizing: border-box; }
        @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulseRing { 0%,100% { opacity: 0.4; transform: scale(1); } 50% { opacity: 0.8; transform: scale(1.04); } }
        @keyframes scanline { 0% { top: -4px; } 100% { top: 100%; } }
        @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes successPop { 0% { transform: scale(0.8); opacity: 0; } 60% { transform: scale(1.05); } 100% { transform: scale(1); opacity: 1; } }
        ::placeholder { color: rgba(255,255,255,0.18) !important; }
        input:-webkit-autofill { -webkit-box-shadow: 0 0 0 1000px #0d1526 inset !important; -webkit-text-fill-color: #e8f0fe !important; }
        ::-webkit-scrollbar { display: none; }
      `}</style>

      {/* Background orbs */}
      <GlowOrb x="-10%" y="-10%" color="#00e5a0" size="500px" />
      <GlowOrb x="60%" y="60%" color="#3b82f6" size="600px" />
      <GlowOrb x="80%" y="-5%" color="#8b5cf6" size="300px" />

      {/* Grid overlay */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.04, pointerEvents: "none",
        backgroundImage: "linear-gradient(rgba(0,229,160,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,160,0.8) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }} />

      {/* Scanline */}
      <div style={{
        position: "absolute", left: 0, right: 0, height: "4px",
        background: "linear-gradient(transparent, rgba(0,229,160,0.06), transparent)",
        animation: "scanline 7s linear infinite", pointerEvents: "none", zIndex: 1,
      }} />

      <div style={{
        width: "100%", maxWidth: "480px", padding: "16px",
        opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.6s ease, transform 0.6s ease", position: "relative", zIndex: 2,
      }}>

        {/* Chart header card */}
        <div style={{
          background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: "20px 20px 0 0", overflow: "hidden", borderBottom: "none",
          animation: mounted ? "fadeUp 0.5s ease both" : "none",
        }}>
          <div style={{ padding: "18px 24px 10px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: "9px", letterSpacing: "0.2em", color: "rgba(0,229,160,0.6)", textTransform: "uppercase", marginBottom: "2px" }}>MARKET OVERVIEW</div>
              <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", fontFamily: "'IBM Plex Mono', monospace" }}>
                <span style={{ color: "#00e5a0", fontWeight: 600 }}>+2.47%</span> today
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "9px", letterSpacing: "0.15em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase" }}>S&P 500</div>
              <div style={{ fontSize: "18px", fontFamily: "'Syne', sans-serif", fontWeight: 700, color: "#fff", letterSpacing: "-0.02em" }}>5,247.61</div>
            </div>
          </div>
          <CandlestickChart />
          <TickerTape />
        </div>

        {/* Main login card */}
        <div style={{
          background: "rgba(10,15,30,0.92)", border: "1px solid rgba(255,255,255,0.08)",
          borderTop: "1px solid rgba(0,229,160,0.2)", borderRadius: "0 0 20px 20px",
          padding: "32px 36px 36px", backdropFilter: "blur(30px)",
          boxShadow: "0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,229,160,0.05)",
          animation: mounted ? "fadeUp 0.6s 0.1s ease both" : "none",
        }}>

          {submitted ? (
            <div style={{ textAlign: "center", padding: "20px 0", animation: "successPop 0.5s ease both" }}>
              <div style={{
                width: "64px", height: "64px", borderRadius: "50%",
                background: "rgba(0,229,160,0.1)", border: "2px solid rgba(0,229,160,0.5)",
                display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px",
                boxShadow: "0 0 30px rgba(0,229,160,0.2)",
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00e5a0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "22px", fontWeight: 800, color: "#fff", marginBottom: "8px" }}>Access Granted</div>
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", letterSpacing: "0.05em" }}>Redirecting to your dashboard...</div>
            </div>
          ) : (
            <>
              {/* Logo */}
              <div style={{ marginBottom: "28px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                  <div style={{
                    width: "34px", height: "34px", borderRadius: "10px",
                    background: "linear-gradient(135deg, rgba(0,229,160,0.2), rgba(0,229,160,0.05))",
                    border: "1px solid rgba(0,229,160,0.4)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0 0 16px rgba(0,229,160,0.15)",
                    animation: "pulseRing 3s ease-in-out infinite",
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00e5a0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                      <polyline points="16 7 22 7 22 13" />
                    </svg>
                  </div>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "26px", fontWeight: 800, letterSpacing: "-0.03em", color: "#fff" }}>
                    tr<span style={{ color: "#00e5a0", fontStyle: "italic" }}>AI</span>der
                  </div>
                </div>
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", letterSpacing: "0.12em", textTransform: "uppercase", paddingLeft: "2px" }}>
                  AI-Powered Stock Intelligence
                </div>
              </div>

              {/* Tabs */}
              <div style={{
                display: "grid", gridTemplateColumns: "1fr 1fr",
                background: "rgba(255,255,255,0.04)", borderRadius: "12px",
                padding: "4px", marginBottom: "28px", border: "1px solid rgba(255,255,255,0.06)",
              }}>
                {["login", "register"].map(t => (
                  <button key={t} onClick={() => setTab(t)} style={{
                    padding: "10px", borderRadius: "8px", border: "none", cursor: "pointer",
                    fontFamily: "'IBM Plex Mono', monospace", fontSize: "11px", letterSpacing: "0.12em",
                    textTransform: "uppercase", fontWeight: 500, transition: "all 0.2s ease",
                    background: tab === t ? "rgba(0,229,160,0.12)" : "transparent",
                    color: tab === t ? "#00e5a0" : "rgba(255,255,255,0.3)",
                    boxShadow: tab === t ? "0 0 0 1px rgba(0,229,160,0.25)" : "none",
                  }}>{t}</button>
                ))}
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit}>
                <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                  {tab === "register" && (
                    <div style={{ animation: "fadeUp 0.3s ease both" }}>
                      <label style={labelStyle}>Username</label>
                      <input
                        type="text" placeholder="your_handle" value={username}
                        onChange={e => setUsername(e.target.value)}
                        onFocus={() => setFocused("username")} onBlur={() => setFocused(null)}
                        style={inputStyle("username")} required
                      />
                    </div>
                  )}
                  <div>
                    <label style={labelStyle}>Email Address</label>
                    <input
                      type="email" placeholder="trader@example.com" value={email}
                      onChange={e => setEmail(e.target.value)}
                      onFocus={() => setFocused("email")} onBlur={() => setFocused(null)}
                      style={inputStyle("email")} required
                    />
                  </div>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "7px" }}>
                      <label style={{ ...labelStyle, marginBottom: 0 }}>Password</label>
                      {tab === "login" && (
                        <button type="button" style={{
                          background: "none", border: "none", cursor: "pointer",
                          fontSize: "10px", color: "rgba(0,229,160,0.6)", letterSpacing: "0.08em",
                          fontFamily: "'IBM Plex Mono', monospace", padding: 0,
                        }}>Forgot?</button>
                      )}
                    </div>
                    <div style={{ position: "relative" }}>
                      <input
                        type={showPass ? "text" : "password"} placeholder="••••••••••" value={password}
                        onChange={e => setPassword(e.target.value)}
                        onFocus={() => setFocused("password")} onBlur={() => setFocused(null)}
                        style={{ ...inputStyle("password"), paddingRight: "44px" }} required
                      />
                      <button type="button" onClick={() => setShowPass(!showPass)} style={{
                        position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)",
                        background: "none", border: "none", cursor: "pointer", padding: 0,
                        color: "rgba(255,255,255,0.3)", display: "flex", alignItems: "center",
                      }}>
                        {showPass
                          ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                          : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        }
                      </button>
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <button type="submit" disabled={loading} style={{
                  width: "100%", marginTop: "28px", padding: "14px",
                  background: loading ? "rgba(0,229,160,0.08)" : "linear-gradient(135deg, rgba(0,229,160,0.18), rgba(0,229,160,0.08))",
                  border: "1px solid rgba(0,229,160,0.4)", borderRadius: "12px", cursor: loading ? "wait" : "pointer",
                  fontFamily: "'IBM Plex Mono', monospace", fontSize: "12px", fontWeight: 600,
                  letterSpacing: "0.2em", textTransform: "uppercase", color: "#00e5a0",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
                  boxShadow: loading ? "none" : "0 0 24px rgba(0,229,160,0.12), inset 0 1px 0 rgba(0,229,160,0.15)",
                  transition: "all 0.2s ease",
                }}>
                  {loading
                    ? <><div style={{ width: "16px", height: "16px", border: "2px solid rgba(0,229,160,0.2)", borderTopColor: "#00e5a0", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />Authenticating</>
                    : <>{tab === "login" ? "Enter Market" : "Create Account"}<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></>
                  }
                </button>
              </form>

              {/* Divider */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "24px 0 20px" }}>
                <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.07)" }} />
                <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.2)", letterSpacing: "0.1em" }}>OR CONTINUE WITH</span>
                <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.07)" }} />
              </div>

              {/* Social */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                {[
                  { label: "Google", icon: <svg width="15" height="15" viewBox="0 0 24 24"><path fill="#ea4335" d="M5.27 9.76A7.08 7.08 0 0 1 18.1 6.72l3.19-3.19A12 12 0 0 0 2.03 8.55z"/><path fill="#34a853" d="M5.27 14.24l-3.24 3.21A12 12 0 0 0 21.29 17.3l-3.46-2.68a7.1 7.1 0 0 1-12.56-.38z"/><path fill="#4285f4" d="M21.29 17.3A12 12 0 0 0 24 12c0-.68-.06-1.34-.17-1.99H12v4.01h6.82a5.76 5.76 0 0 1-1.99 2.98z"/><path fill="#fbbc05" d="M5.27 9.76l-3.24-3.21A12 12 0 0 0 .17 12c0 1.99.49 3.86 1.36 5.51L5.27 14.24A7.14 7.14 0 0 1 5 12c0-.77.13-1.52.27-2.24z"/></svg> },
                  { label: "Apple", icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="rgba(255,255,255,0.7)"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg> },
                ].map(({ label, icon }) => (
                  <button key={label} type="button" style={{
                    padding: "11px 16px", background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                    fontFamily: "'IBM Plex Mono', monospace", fontSize: "11px", color: "rgba(255,255,255,0.5)",
                    letterSpacing: "0.06em", transition: "all 0.2s ease",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
                  >
                    {icon} {label}
                  </button>
                ))}
              </div>

              {/* Footer */}
              <div style={{ marginTop: "24px", textAlign: "center", fontSize: "10px", color: "rgba(255,255,255,0.2)", letterSpacing: "0.05em", lineHeight: 1.7 }}>
                By continuing you agree to our{" "}
                <span style={{ color: "rgba(0,229,160,0.5)", cursor: "pointer" }}>Terms</span>{" "}&{" "}
                <span style={{ color: "rgba(0,229,160,0.5)", cursor: "pointer" }}>Privacy Policy</span>
                <br />
                <span style={{ opacity: 0.6 }}>Market data for informational purposes only</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}