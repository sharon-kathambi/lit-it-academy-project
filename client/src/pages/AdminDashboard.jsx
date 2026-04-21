import { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from "recharts";

const ADMIN_TOKEN = import.meta.env.VITE_ADMIN_TOKEN || "changeme";

const API = (path) => `http://127.0.0.1:8000/api${path}&token=${ADMIN_TOKEN}`;

const sentimentColor = { positive: "#2d7a3a", neutral: "#888780", negative: "#f09595" };
const sentimentBg   = { positive: "rgba(200,240,144,0.1)", neutral: "rgba(136,135,128,0.12)", negative: "rgba(240,149,149,0.1)" };

function StatCard({ label, value, accent }) {
  return (
    <div style={{
      background: "#ffffff",
      border: "0.5px solid #222",
      borderRadius: "16px",
      padding: "1.1rem 1.25rem",
      animation: "fadeUp 0.4s ease both",
    }}>
      <p style={{ fontSize: "11px", color: "#555", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px", fontFamily: "'DM Sans', sans-serif" }}>{label}</p>
      <p style={{ fontSize: "26px", fontWeight: 400, color: accent || "#1a1714", fontFamily: "'DM Serif Display', Georgia, serif", margin: 0 }}>{value}</p>
    </div>
  );
}

function SentimentBadge({ sentiment }) {
  if (!sentiment) return null;
  return (
    <span style={{
      fontSize: "11px",
      padding: "3px 10px",
      borderRadius: "99px",
      fontWeight: 500,
      background: sentimentBg[sentiment],
      color: sentimentColor[sentiment],
      whiteSpace: "nowrap",
      fontFamily: "'DM Sans', sans-serif",
    }}>
      {sentiment}
    </span>
  );
}

function Stars({ value }) {
  return (
    <span style={{ color: "#2d7a3a", fontSize: "12px", letterSpacing: "1px" }}>
      {"★".repeat(value)}{"☆".repeat(5 - value)}
    </span>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div style={{ background: "#1a1a1a", border: "0.5px solid #d8d3cc", borderRadius: "10px", padding: "8px 14px", fontFamily: "'DM Sans', sans-serif" }}>
        <p style={{ color: "#888", fontSize: "11px", margin: "0 0 4px" }}>{label}</p>
        <p style={{ color: "#2d7a3a", fontSize: "14px", fontWeight: 500, margin: 0 }}>{payload[0].value} reviews</p>
      </div>
    );
  }
  return null;
};

export default function AdminDashboard() {
  const [days, setDays]         = useState(30);
  const [stats, setStats]       = useState(null);
  const [reviews, setReviews]   = useState([]);
  const [insights, setInsights] = useState(null);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [loadingTag, setLoadingTag]           = useState(false);
  const [insightError, setInsightError]       = useState("");
  const [statsLoading, setStatsLoading]       = useState(true);

  useEffect(() => {
    setStatsLoading(true);
    Promise.all([
      fetch(API(`/feedback/stats?days=${days}`)).then(r => r.json()),
      fetch(API(`/feedback/?days=${days}&limit=20`)).then(r => r.json()),
    ]).then(([s, r]) => {
      setStats(s);
      setReviews(Array.isArray(r) ? r : []);
      setStatsLoading(false);
    }).catch(() => setStatsLoading(false));
  }, [days]);

  const chartData = (() => {
    const counts = {};
    reviews.forEach(r => {
      const d = new Date(r.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
      counts[d] = (counts[d] || 0) + 1;
    });
    return Object.entries(counts).slice(-7).map(([date, count]) => ({ date, count }));
  })();

  async function generateInsights() {
    setLoadingInsights(true);
    setInsightError("");
    setInsights(null);
    try {
      const res = await fetch(API(`/insights/?days=${days}`), { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Failed");
      setInsights(data.insights);
    } catch (e) {
      setInsightError(e.message);
    } finally {
      setLoadingInsights(false);
    }
  }

  async function tagSentiment() {
    setLoadingTag(true);
    try {
      await fetch(API(`/insights/tag-sentiment?days=${days}`), { method: "POST" });
      const r = await fetch(API(`/feedback/?days=${days}&limit=20`)).then(x => x.json());
      setReviews(Array.isArray(r) ? r : []);
    } finally {
      setLoadingTag(false);
    }
  }

  const senCounts = stats?.sentiment_counts || {};
  const senTotal  = (senCounts.positive || 0) + (senCounts.neutral || 0) + (senCounts.negative || 0);
  const pct = (v) => senTotal ? Math.round((v / senTotal) * 100) : 0;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #f5f2ee; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0%   { opacity: 0.4; }
          50%  { opacity: 0.8; }
          100% { opacity: 0.4; }
        }
        .shimmer { animation: shimmer 1.5s ease infinite; background: #1a1a1a; border-radius: 8px; }
        .action-btn {
          background: #2d7a3a; border: none; border-radius: 99px;
          color: #f5f2ee; font-size: 12px; font-weight: 500;
          padding: 8px 18px; cursor: pointer;
          font-family: 'DM Sans', sans-serif; transition: background 0.2s;
        }
        .action-btn:hover { background: #b8e078; }
        .action-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .ghost-btn {
          background: none; border: 0.5px solid #d8d3cc; border-radius: 99px;
          color: #888; font-size: 12px; font-weight: 400;
          padding: 8px 18px; cursor: pointer;
          font-family: 'DM Sans', sans-serif; transition: border-color 0.2s, color 0.2s;
        }
        .ghost-btn:hover { border-color: #444; color: #ccc; }
        .ghost-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .review-row { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; padding: 12px 0; border-bottom: 0.5px solid #1a1a1a; animation: fadeUp 0.3s ease both; }
        .review-row:last-child { border-bottom: none; }
        select { background: #ffffff; border: 0.5px solid #d8d3cc; color: #888; border-radius: 99px; padding: 7px 16px; font-size: 12px; font-family: 'DM Sans', sans-serif; cursor: pointer; }
        select:focus { outline: none; border-color: #444; }
        .bar-track { flex: 1; background: #1e1e1e; border-radius: 99px; height: 5px; overflow: hidden; }
        .bar-fill { height: 100%; border-radius: 99px; transition: width 1.2s cubic-bezier(0.4,0,0.2,1); }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#f5f2ee", padding: "1.75rem 1.25rem 4rem", maxWidth: "520px", margin: "0 auto", fontFamily: "'DM Sans', sans-serif" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.75rem", animation: "fadeUp 0.35s ease both" }}>
          <div>
            <p style={{ fontSize: "11px", color: "#555", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "6px" }}>Admin dashboard</p>
            <h1 style={{ fontFamily: "'DM Serif Display', Georgia, serif", color: "#1a1714", fontSize: "26px", fontWeight: 400 }}>
              Cedar Gardens & Restaurant
            </h1>
          </div>
          <select value={days} onChange={e => setDays(Number(e.target.value))}>
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
        </div>

        {/* Stat cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0,1fr))", gap: "10px", marginBottom: "1.25rem" }}>
          {statsLoading ? (
            [1,2,3,4].map(i => <div key={i} className="shimmer" style={{ height: "88px" }} />)
          ) : (
            <>
              <StatCard label="Total reviews" value={stats?.total ?? 0} />
              <StatCard label="Avg overall"   value={stats?.avg_overall ? `${stats.avg_overall} ★` : "—"} accent="#2d7a3a" />
              <StatCard label="Avg food"      value={stats?.avg_food    ? `${stats.avg_food} ★`    : "—"} />
              <StatCard label="Avg service"   value={stats?.avg_service ? `${stats.avg_service} ★` : "—"}
                accent={stats?.avg_service < 3.5 ? "#f09595" : "#1a1714"} />
            </>
          )}
        </div>

        {/* Sentiment bars */}
        <div style={{ background: "#ffffff", border: "0.5px solid #222", borderRadius: "16px", padding: "1.1rem 1.25rem", marginBottom: "1.25rem", animation: "fadeUp 0.4s ease 0.1s both" }}>
          <p style={{ fontSize: "11px", color: "#555", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "14px" }}>Sentiment breakdown</p>
          {[
            { label: "Positive", key: "positive", color: "#2d7a3a" },
            { label: "Neutral",  key: "neutral",  color: "#888780" },
            { label: "Negative", key: "negative", color: "#f09595" },
          ].map(({ label, key, color }) => (
            <div key={key} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: key === "negative" ? 0 : "10px" }}>
              <span style={{ fontSize: "12px", color: "#666", width: "58px" }}>{label}</span>
              <div className="bar-track">
                <div className="bar-fill" style={{ width: `${pct(senCounts[key] || 0)}%`, background: color }} />
              </div>
              <span style={{ fontSize: "12px", color, minWidth: "32px", textAlign: "right" }}>{pct(senCounts[key] || 0)}%</span>
            </div>
          ))}
        </div>

        {/* Reviews over time chart */}
        {chartData.length > 1 && (
          <div style={{ background: "#ffffff", border: "0.5px solid #222", borderRadius: "16px", padding: "1.1rem 1.25rem", marginBottom: "1.25rem", animation: "fadeUp 0.4s ease 0.15s both" }}>
            <p style={{ fontSize: "11px", color: "#555", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "14px" }}>Reviews over time</p>
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={chartData} barSize={16}>
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#555", fontFamily: "'DM Sans', sans-serif" }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={i === chartData.length - 1 ? "#2d7a3a" : "#d8d3cc"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* AI Insights */}
        <div style={{ background: "#ffffff", border: "0.5px solid #222", borderRadius: "16px", padding: "1.1rem 1.25rem", marginBottom: "1.25rem", animation: "fadeUp 0.4s ease 0.2s both" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: insights ? "16px" : "0" }}>
            <p style={{ fontSize: "11px", color: "#555", textTransform: "uppercase", letterSpacing: "0.1em" }}>AI insights</p>
            <button className="action-btn" onClick={generateInsights} disabled={loadingInsights}>
              {loadingInsights ? "Thinking..." : insights ? "Regenerate" : "Generate insights"}
            </button>
          </div>

          {!insights && !loadingInsights && (
            <p style={{ fontSize: "13px", color: "#333", textAlign: "center", padding: "1.25rem 0" }}>
              Click to summarize all feedback with Gemini
            </p>
          )}

          {loadingInsights && (
            <div style={{ padding: "1rem 0" }}>
              {[80, 60, 70, 50].map((w, i) => (
                <div key={i} className="shimmer" style={{ height: "12px", width: `${w}%`, marginBottom: "10px" }} />
              ))}
            </div>
          )}

          {insightError && (
            <p style={{ color: "#f09595", fontSize: "13px", marginTop: "10px" }}>{insightError}</p>
          )}

          {insights && (
            <div style={{ animation: "fadeUp 0.4s ease both" }}>
              {/* Highlight */}
              <div style={{ background: "rgba(200,240,144,0.07)", border: "0.5px solid rgba(200,240,144,0.2)", borderRadius: "10px", padding: "12px", marginBottom: "16px" }}>
                <p style={{ fontSize: "11px", color: "#555", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "5px" }}>This week's highlight</p>
                <p style={{ fontSize: "13px", color: "#2d7a3a", lineHeight: 1.5 }}>{insights.highlight}</p>
              </div>

              <p style={{ fontSize: "13px", color: "#888", lineHeight: 1.6, marginBottom: "16px" }}>{insights.summary}</p>

              {[
                { label: "What customers love", items: insights.positives, color: "#2d7a3a" },
                { label: "Issues to fix",        items: insights.issues,    color: "#f09595" },
                { label: "Suggestions",          items: insights.suggestions, color: "#888" },
              ].map(({ label, items, color }) => items?.length > 0 && (
                <div key={label} style={{ marginBottom: "14px" }}>
                  <p style={{ fontSize: "11px", color: "#555", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>{label}</p>
                  {items.map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start", padding: "6px 0", borderBottom: i < items.length - 1 ? "0.5px solid #1e1e1e" : "none" }}>
                      <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: color, marginTop: "6px", flexShrink: 0 }} />
                      <p style={{ fontSize: "13px", color: "#ccc", lineHeight: 1.5 }}>{item}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Reviews */}
        <div style={{ background: "#ffffff", border: "0.5px solid #222", borderRadius: "16px", padding: "1.1rem 1.25rem", animation: "fadeUp 0.4s ease 0.25s both" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
            <p style={{ fontSize: "11px", color: "#555", textTransform: "uppercase", letterSpacing: "0.1em" }}>Recent reviews</p>
            <button className="ghost-btn" onClick={tagSentiment} disabled={loadingTag}>
              {loadingTag ? "Tagging..." : "Tag sentiment"}
            </button>
          </div>

          {reviews.length === 0 && (
            <p style={{ fontSize: "13px", color: "#333", textAlign: "center", padding: "1.25rem 0" }}>
              No reviews yet. Share your QR code!
            </p>
          )}

          {reviews.map((r, i) => (
            <div key={r.id} className="review-row" style={{ animationDelay: `${i * 0.04}s` }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", gap: "12px", marginBottom: "4px", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "12px", color: "#666" }}>Food <Stars value={r.food_rating} /></span>
                  <span style={{ fontSize: "12px", color: "#666" }}>Service <Stars value={r.service_rating} /></span>
                  <span style={{ fontSize: "12px", color: "#666" }}>Overall <Stars value={r.overall_rating} /></span>
                </div>
                {r.comment && (
                  <p style={{ fontSize: "12px", color: "#555", lineHeight: 1.5, marginTop: "4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {r.comment}
                  </p>
                )}
                <p style={{ fontSize: "11px", color: "#333", marginTop: "4px" }}>
                  {new Date(r.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </div>
              <SentimentBadge sentiment={r.sentiment} />
            </div>
          ))}
        </div>

        {/* QR Link */}
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <a
            href={`/api/qr/?token=${ADMIN_TOKEN}`}
            target="_blank"
            rel="noreferrer"
            style={{ fontSize: "12px", color: "#444", textDecoration: "none", borderBottom: "0.5px solid #333", paddingBottom: "2px" }}
          >
            Download QR code
          </a>
        </div>

      </div>
    </>
  );
}
