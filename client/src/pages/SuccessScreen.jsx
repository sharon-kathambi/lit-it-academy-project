import React from 'react'

function SuccessScreen({ onReset }) {
  return (
     <div style={{
      minHeight: "100vh",
      background: "#0d0d0d",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem",
      textAlign: "center",
      fontFamily: "'DM Serif Display', Georgia, serif",
    }}>
      <div style={{
        width: "72px",
        height: "72px",
        borderRadius: "50%",
        background: "#c8f090",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "32px",
        marginBottom: "1.5rem",
        animation: "pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
      }}>✓</div>
      <h2 style={{ color: "#f5f0e8", fontSize: "28px", margin: "0 0 0.75rem", fontWeight: 400 }}>
        Thank you!
      </h2>
      <p style={{
        color: "#888",
        fontFamily: "'DM Sans', sans-serif",
        fontSize: "15px",
        lineHeight: 1.6,
        maxWidth: "280px",
        margin: "0 0 2rem",
      }}>
        Your feedback helps us make every meal better.
      </p>
      <button
        onClick={onReset}
        style={{
          background: "none",
          border: "0.5px solid #333",
          color: "#888",
          borderRadius: "99px",
          padding: "8px 20px",
          fontSize: "13px",
          fontFamily: "'DM Sans', sans-serif",
          cursor: "pointer",
        }}
      >
        Submit another
      </button>
    </div>
  )
}

export default SuccessScreen