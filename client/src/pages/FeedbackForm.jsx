import React from 'react'
import { useState } from 'react';
import StarRating from '../components/StarRating';

const categories = [
  { key: "food", label: "Food", icon: "🍽️" },
  { key: "service", label: "Service", icon: "🤝" },
  { key: "overall", label: "Overall", icon: "✨" },
];

const ratingLabels = ["", "Poor", "Fair", "Good", "Great", "Excellent"];

function FeedbackForm() {
    const [ratings, setRatings] = useState({ food: 0, service: 0, overall: 0 });
      const [comment, setComment] = useState("");
      const [submitted, setSubmitted] = useState(false);
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState("");
    
      const allRated = Object.values(ratings).every((r) => r > 0);
    
      async function handleSubmit() {
        if (!allRated) {
          setError("Please rate all three categories before submitting.");
          return;
        }
        setError("");
        setLoading(true);
        try {
          const res = await fetch("/api/feedback", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              food_rating: ratings.food,
              service_rating: ratings.service,
              overall_rating: ratings.overall,
              comment,
            }),
          });
          if (!res.ok) throw new Error("Server error");
          setSubmitted(true);
        } catch {
          setError("Something went wrong. Please try again.");
        } finally {
          setLoading(false);
        }
      }
    
      if (submitted) {
        return <SuccessScreen onReset={() => { setSubmitted(false); setRatings({ food: 0, service: 0, overall: 0 }); setComment(""); }} />;
      }
      
  return (
   <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0d0d0d; }
        textarea::placeholder { color: #555; }
        textarea:focus { outline: none; border-color: #c8f090 !important; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pop {
          from { transform: scale(0.5); opacity: 0; }
          to   { transform: scale(1); opacity: 1; }
        }
        .card { animation: fadeUp 0.4s ease both; }
        .card:nth-child(1) { animation-delay: 0.05s; }
        .card:nth-child(2) { animation-delay: 0.12s; }
        .card:nth-child(3) { animation-delay: 0.19s; }
        .card:nth-child(4) { animation-delay: 0.26s; }
        .submit-btn:not(:disabled):hover { background: #b8e078 !important; }
        .submit-btn:disabled { opacity: 0.4; cursor: not-allowed; }
      `}</style>

      <div style={{
        minHeight: "100vh",
        background: "#0d0d0d",
        padding: "2rem 1.25rem 3rem",
        fontFamily: "'DM Sans', sans-serif",
        maxWidth: "420px",
        margin: "0 auto",
      }}>

        {/* Header */}
        <div style={{ marginBottom: "2rem", animation: "fadeUp 0.35s ease both" }}>
          <p style={{ color: "#555", fontSize: "12px", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "8px" }}>
            How was your visit?
          </p>
          <h1 style={{
            fontFamily: "'DM Serif Display', Georgia, serif",
            color: "#f5f0e8",
            fontSize: "32px",
            fontWeight: 400,
            lineHeight: 1.2,
          }}>
            Share your experience
          </h1>
        </div>

        {/* Rating cards */}
        {categories.map(({ key, label, icon }) => (
          <div key={key} className="card" style={{
            background: "#161616",
            border: `0.5px solid ${ratings[key] ? "#2a2a2a" : "#1e1e1e"}`,
            borderRadius: "16px",
            padding: "1.25rem",
            marginBottom: "12px",
            transition: "border-color 0.2s",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "16px" }}>{icon}</span>
                <span style={{ color: "#f5f0e8", fontSize: "15px", fontWeight: 500 }}>{label}</span>
              </div>
              {ratings[key] > 0 && (
                <span style={{
                  fontSize: "11px",
                  color: "#c8f090",
                  background: "rgba(200,240,144,0.1)",
                  padding: "2px 10px",
                  borderRadius: "99px",
                  fontWeight: 500,
                }}>
                  {ratingLabels[ratings[key]]}
                </span>
              )}
            </div>
            <StarRating
              value={ratings[key]}
              onChange={(v) => setRatings((r) => ({ ...r, [key]: v }))}
            />
          </div>
        ))}

        {/* Comment box */}
        <div className="card" style={{
          background: "#161616",
          border: "0.5px solid #1e1e1e",
          borderRadius: "16px",
          padding: "1.25rem",
          marginBottom: "20px",
        }}>
          <label style={{ color: "#888", fontSize: "12px", letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: "10px" }}>
            Anything else? (optional)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell us what you loved or what we can improve..."
            rows={3}
            style={{
              width: "100%",
              background: "none",
              border: "0.5px solid #2a2a2a",
              borderRadius: "10px",
              color: "#f5f0e8",
              fontSize: "14px",
              lineHeight: 1.6,
              padding: "10px 12px",
              resize: "none",
              fontFamily: "'DM Sans', sans-serif",
              transition: "border-color 0.2s",
            }}
          />
        </div>

        {/* Error */}
        {error && (
          <p style={{ color: "#f09595", fontSize: "13px", marginBottom: "12px", textAlign: "center" }}>
            {error}
          </p>
        )}

        {/* Submit */}
        <button
          className="submit-btn"
          onClick={handleSubmit}
          disabled={loading || !allRated}
          style={{
            width: "100%",
            background: "#c8f090",
            border: "none",
            borderRadius: "99px",
            color: "#0d0d0d",
            fontSize: "15px",
            fontWeight: 500,
            padding: "15px",
            cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif",
            transition: "background 0.2s, transform 0.1s",
            letterSpacing: "0.02em",
          }}
        >
          {loading ? "Submitting..." : "Submit feedback"}
        </button>

        {!allRated && (
          <p style={{ color: "#444", fontSize: "12px", textAlign: "center", marginTop: "10px" }}>
            Rate all three to continue
          </p>
        )}
      </div>
    </>
  )
}

export default FeedbackForm