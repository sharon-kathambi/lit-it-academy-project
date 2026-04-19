import React from 'react'
import { useState } from 'react';

function StarRating({ value, onChange }) {
    const [hovered, setHovered] = useState(0);
    const active = hovered || value;

  return (
    <div style={{ display: "flex", gap: "8px" }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "4px",
            fontSize: "32px",
            lineHeight: 1,
            transform: active >= star ? "scale(1.15)" : "scale(1)",
            transition: "transform 0.15s ease, filter 0.15s ease",
            filter: active >= star ? "none" : "grayscale(1) opacity(0.35)",
          }}
          aria-label={`${star} star`}
        >
          ★
        </button>
      ))}
    </div>
  )
}

export default StarRating