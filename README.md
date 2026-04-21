# 🍽️ Cedar Gardens — Customer Feedback & Insights App
 
A full-stack web app that collects customer feedback for a restaurant via QR codes and uses Google Gemini AI to generate actionable insights for the owner.

---
 
## Features
 
- **Customer feedback form** — mobile-first form accessible via QR code at each table. Customers rate food, service, and overall experience and leave an optional comment.
- **AI-powered insights** — Google Gemini analyzes all feedback and generates a plain-English summary with positives, issues, and suggestions.
- **Admin dashboard** — protected by email + password login. Shows rating stats, sentiment breakdown, reviews over time, and the AI insights panel.
- **Sentiment tagging** — Gemini automatically tags each review as positive, neutral, or negative.
- **QR code generation** — generates a printable QR code pointing to the feedback form.
---
 
## Tech Stack
 
| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite + Recharts |
| Backend | Python + FastAPI + SQLModel |
| Database | SQLite |
| AI | Google Gemini API (`gemini-2.5-flash`) |
| Deployment | Vercel (frontend) + Render (backend) |
 
---
 
## Project Structure
 
```
restaurant-feedback/
├── client/                   # React + Vite frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── FeedbackForm.jsx    # Customer-facing feedback form
│   │   │   ├── AdminDashboard.jsx  # Owner dashboard
│   │   │   └── Login.jsx           # Admin login page
│   │   └── App.jsx
│   ├── .env                  # Frontend env variables
│   └── vercel.json
│
└── server/                   # FastAPI backend
    ├── routes/
    │   ├── feedback.py       # POST/GET feedback endpoints
    │   ├── insights.py       # Gemini AI insights endpoints
    │   └── qr.py             # QR code generation
    ├── main.py               # App entry point + middleware
    ├── database.py           # SQLite setup
    ├── models.py             # SQLModel table definitions
    ├── requirements.txt
    └── .env                  # Backend env variables
```
 
---
 
## Getting Started
 
### Prerequisites
 
- Node.js 18+
- Python 3.10+
- A Google Gemini API key
---
 

 
## Usage
 
### For customers `https://feedback-restaurant-chi.vercel.app/feedback`
1. Scan the QR code at the table
2. Rate food, service, and overall experience
3. Leave an optional comment and submit
   
### For the restaurant owner `https://feedback-restaurant-chi.vercel.app/admin`
1. Visit `/admin` and log in with your email and password
2. Email - admin@cedargardens.com
3. Password - admin
4. View rating stats and recent reviews
5. Click **"Tag sentiment"** to auto-tag reviews as positive/neutral/negative
6. Click **"Generate insights"** to get an AI summary of all feedback
### Print QR codes
Visit `http://your-backend-url/api/qr/` to download the feedback QR code.
For per-table QR codes use `?table=1`, `?table=2`, etc.
 
## Built With
 
This project was built as an AI project to bring tech to a family-owned restaurant. It demonstrates a full-stack app with a React frontend, FastAPI backend, SQLite database, and Google Gemini AI integration.
 
