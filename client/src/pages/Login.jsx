import { useState } from "react";

const ADMIN_TOKEN = import.meta.env.VITE_ADMIN_TOKEN || "changeme";

export default function Login({ onLogin }) {
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  function handleSubmit() {
    if (!password) return;
    setLoading(true);
    setError("");

    setTimeout(() => {
      if (password === ADMIN_TOKEN) {
        sessionStorage.setItem("admin_authed", "true");
        onLogin();
      } else {
        setError("Incorrect password. Try again.");
        setPassword("");
      }
      setLoading(false);
    }, 600);
  }

  function handleKey(e) {
    if (e.key === "Enter") handleSubmit();
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
          0%, 100% { transform: translateX(0); }
          20%       { transform: translateX(-8px); }
          40%       { transform: translateX(8px); }
          60%       { transform: translateX(-5px); }
          80%       { transform: translateX(5px); }
        }
        .shake { animation: shake 0.4s ease; }
        .login-input {
          width: 100%;
          background: #ffffff;
          border: 0.5px solid #d8d3cc;
          border-radius: 12px;
          color: #1a1714;
          font-size: 15px;
          padding: 14px 16px;
          font-family: 'DM Sans', sans-serif;
          transition: border-color 0.2s;
          letter-spacing: 0.08em;
        }
        .login-input:focus { outline: none; border-color: #2d7a3a; }
        .login-input.error-field { border-color: #f09595; }
        .login-btn {
          width: 100%;
          background: #2d7a3a;
          border: none;
          border-radius: 99px;
          color: #f5f2ee;
          font-size: 15px;
          font-weight: 500;
          padding: 15px;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: background 0.2s, opacity 0.2s;
          letter-spacing: 0.02em;
        }
        .login-btn:hover:not(:disabled) { background: #b8e078; }
        .login-btn:disabled { opacity: 0.5; cursor: not-allowed; }
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

        {/* Logo mark */}
        <div style={{
          width: "52px",
          height: "52px",
          borderRadius: "14px",
          background: "#ffffff",
          border: "0.5px solid #d8d3cc",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "22px",
          marginBottom: "1.5rem",
          animation: "fadeUp 0.3s ease both",
        }}>
          🍽️
        </div>

        {/* Heading */}
        <div style={{ textAlign: "center", marginBottom: "2rem", animation: "fadeUp 0.35s ease 0.05s both" }}>
          <h1 style={{
            fontFamily: "'DM Serif Display', Georgia, serif",
            color: "#1a1714",
            fontSize: "28px",
            fontWeight: 400,
            marginBottom: "8px",
          }}>
            Admin access
          </h1>
          <p style={{ color: "#555", fontSize: "14px", lineHeight: 1.6 }}>
            Enter your password to view the dashboard
          </p>
        </div>

        {/* Card */}
        <div style={{
          width: "100%",
          maxWidth: "360px",
          background: "#ffffff",
          border: "0.5px solid #222",
          borderRadius: "20px",
          padding: "1.75rem",
          animation: "fadeUp 0.4s ease 0.1s both",
        }}>
          <label style={{
            fontSize: "11px",
            color: "#555",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            display: "block",
            marginBottom: "10px",
          }}>
            Password
          </label>

          <input
            type="password"
            className={`login-input ${error ? "error-field shake" : ""}`}
            value={password}
            onChange={e => { setPassword(e.target.value); setError(""); }}
            onKeyDown={handleKey}
            placeholder="••••••••"
            autoFocus
          />

          {error && (
            <p style={{
              color: "#f09595",
              fontSize: "12px",
              marginTop: "8px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}>
              <span style={{ fontSize: "14px" }}>⚠</span> {error}
            </p>
          )}

          <button
            className="login-btn"
            onClick={handleSubmit}
            disabled={loading || !password}
            style={{ marginTop: "1.25rem" }}
          >
            {loading ? "Checking..." : "Enter dashboard"}
          </button>
        </div>

        <p style={{
          color: "#333",
          fontSize: "12px",
          marginTop: "1.5rem",
          animation: "fadeUp 0.4s ease 0.15s both",
        }}>
          Customer feedback form →{" "}
          <a href="/feedback" style={{ color: "#555", textDecoration: "none", borderBottom: "0.5px solid #333" }}>
            /feedback
          </a>
        </p>

      </div>
    </>
  );
}
