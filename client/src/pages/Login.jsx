import { useState } from "react";

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;
const ADMIN_TOKEN = import.meta.env.VITE_ADMIN_TOKEN;

export default function Login({ onLogin }) {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [shake, setShake]       = useState(false);

  function triggerShake() {
    setShake(true);
    setTimeout(() => setShake(false), 400);
  }

  function handleSubmit() {
    if (!email || !password) {
      setError("Please enter both email and password.");
      triggerShake();
      return;
    }
    setLoading(true);
    setError("");

    setTimeout(() => {
      if (email.trim() === ADMIN_EMAIL.trim() && password === ADMIN_TOKEN) {
        sessionStorage.setItem("admin_authed", "true");
        if (onLogin) onLogin();
      } else {
        setError("Incorrect email or password.");
        setPassword("");
        triggerShake();
      }
      setLoading(false);
    }, 600);
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #f5f2ee; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          20%     { transform: translateX(-8px); }
          40%     { transform: translateX(8px); }
          60%     { transform: translateX(-5px); }
          80%     { transform: translateX(5px); }
        }
        .shake { animation: shake 0.4s ease; }
        .login-input {
          width: 100%;
          background: #f5f2ee;
          border: 0.5px solid #d8d3cc;
          border-radius: 12px;
          color: #1a1714;
          font-size: 15px;
          padding: 14px 16px;
          font-family: 'DM Sans', sans-serif;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .login-input:focus {
          outline: none;
          border-color: #2d7a3a;
          box-shadow: 0 0 0 3px rgba(45,122,58,0.1);
        }
        .login-input.err { border-color: #c0392b; }
        .login-input::placeholder { color: #b0aaa4; }
        .login-btn {
          width: 100%;
          background: #2d7a3a;
          border: none;
          border-radius: 12px;
          color: #ffffff;
          font-size: 15px;
          font-weight: 500;
          padding: 15px;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: background 0.2s;
          margin-top: 4px;
        }
        .login-btn:hover:not(:disabled) { background: #245f2e; }
        .login-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .lbl {
          font-size: 11px;
          color: #6b6560;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 6px;
          display: block;
          font-family: 'DM Sans', sans-serif;
        }
      `}</style>

      <div style={{
        minHeight: "100vh",
        background: "#f5f2ee",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1.25rem",
        fontFamily: "'DM Sans', sans-serif",
      }}>

        {/* Logo */}
        <div style={{
          width: "56px", height: "56px", borderRadius: "16px",
          background: "#ffffff", border: "0.5px solid #d8d3cc",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "24px", marginBottom: "1.5rem",
          animation: "fadeUp 0.3s ease both",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        }}>
          🍽️
        </div>

        <h1 style={{ fontFamily: "'DM Serif Display', Georgia, serif", color: "#1a1714", fontSize: "26px", fontWeight: 400 }}>
              Cedar Gardens & Restaurant
            </h1>

        {/* Heading */}
        <div style={{ textAlign: "center", marginBottom: "2rem", animation: "fadeUp 0.35s ease 0.05s both" }}>
          <h1 style={{
            fontFamily: "'DM Serif Display', Georgia, serif",
            color: "#1a1714", fontSize: "28px", fontWeight: 400, marginBottom: "8px",
          }}>
            Welcome back
          </h1>
          <p style={{ color: "#8a8480", fontSize: "14px", lineHeight: 1.6 }}>
            Sign in to view your dashboard
          </p>
        </div>

        {/* Card */}
        <div
          className={shake ? "shake" : ""}
          style={{
            width: "100%", maxWidth: "380px",
            background: "#ffffff", border: "0.5px solid #d8d3cc",
            borderRadius: "20px", padding: "1.75rem",
            animation: "fadeUp 0.4s ease 0.1s both",
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          }}
        >
          {/* Email */}
          <div style={{ marginBottom: "1rem" }}>
            <label className="lbl">Email</label>
            <input
              type="email"
              className={`login-input ${error ? "err" : ""}`}
              value={email}
              onChange={e => { setEmail(e.target.value); setError(""); }}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
              placeholder="admin@cedargardens.com"
              autoFocus
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: "1.25rem" }}>
            <label className="lbl">Password</label>
            <input
              type="password"
              className={`login-input ${error ? "err" : ""}`}
              value={password}
              onChange={e => { setPassword(e.target.value); setError(""); }}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
              placeholder="••••••••"
            />
          </div>

          {/* Error */}
          {error && (
            <div style={{
              background: "rgba(192,57,43,0.07)",
              border: "0.5px solid rgba(192,57,43,0.2)",
              borderRadius: "10px", padding: "10px 14px",
              marginBottom: "1rem", display: "flex",
              alignItems: "center", gap: "8px",
            }}>
              <span>⚠️</span>
              <p style={{ color: "#c0392b", fontSize: "13px" }}>{error}</p>
            </div>
          )}

          <button
            className="login-btn"
            onClick={handleSubmit}
            disabled={loading || !email || !password}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </div>

        <p style={{ color: "#b0aaa4", fontSize: "12px", marginTop: "1.5rem", animation: "fadeUp 0.4s ease 0.15s both" }}>
          Customer feedback form →{" "}
          <a href="/feedback" style={{ color: "#8a8480", textDecoration: "none", borderBottom: "0.5px solid #d8d3cc" }}>
            /feedback
          </a>
        </p>

      </div>
    </>
  );
}
