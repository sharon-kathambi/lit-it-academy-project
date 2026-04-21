import os
import json
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from datetime import datetime, timedelta

from google import genai
from dotenv import load_dotenv
from database import get_session
from models import Feedback

load_dotenv()

router = APIRouter(prefix="/api/insights", tags=["insights"])

_client = None

def get_client():
    global _client
    if _client is None:
        _client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
    return _client 


def call_gemini(prompt: str) -> str:
    response = get_client().models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
    )
    return response.text.strip()


def parse_json(raw: str):
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
    return json.loads(raw.strip())


@router.post("/")
def generate_insights(days: int = 30, session: Session = Depends(get_session)):
    since = datetime.utcnow() - timedelta(days=days)
    rows = session.exec(
        select(Feedback).where(Feedback.created_at >= since)
    ).all()

    if not rows:
        raise HTTPException(status_code=404, detail="No feedback found for this period.")

    feedback_list = [
        {
            "food_rating": r.food_rating,
            "service_rating": r.service_rating,
            "overall_rating": r.overall_rating,
            "comment": r.comment or "",
            "date": r.created_at.strftime("%Y-%m-%d"),
        }
        for r in rows
    ]

    prompt = f"""
You are analyzing customer feedback for a small family restaurant.
Here is the feedback from the last {days} days ({len(feedback_list)} reviews):

{json.dumps(feedback_list, indent=2)}

Respond ONLY with a valid JSON object — no markdown, no explanation, no backticks.
Use this exact structure:
{{
  "summary": "2-3 sentence plain-English summary of how the restaurant is doing overall",
  "positives": ["specific thing customers praised", "another positive"],
  "issues": ["specific problem mentioned by customers", "another issue if any"],
  "suggestions": ["one actionable improvement suggestion", "another if relevant"],
  "highlight": "the single most important thing to act on this week"
}}
Be specific. Reference actual patterns in the data. Keep each point under 15 words.
"""

    try:
        raw = call_gemini(prompt)
        insights = parse_json(raw)
        return {"insights": insights, "review_count": len(rows), "days": days}
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Gemini returned malformed JSON. Try again.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/tag-sentiment")
def tag_sentiment(days: int = 7, session: Session = Depends(get_session)):
    since = datetime.utcnow() - timedelta(days=days)
    untagged = session.exec(
        select(Feedback)
        .where(Feedback.created_at >= since)
        .where(Feedback.sentiment == None)
    ).all()

    if not untagged:
        return {"message": "No untagged feedback found.", "tagged": 0}

    items = [
        {
            "id": r.id,
            "food": r.food_rating,
            "service": r.service_rating,
            "overall": r.overall_rating,
            "comment": r.comment or "",
        }
        for r in untagged
    ]

    prompt = f"""
Tag each feedback entry as "positive", "neutral", or "negative" based on ratings and comment.
Input: {json.dumps(items)}

Respond ONLY with a JSON array like:
[{{"id": 1, "sentiment": "positive"}}, {{"id": 2, "sentiment": "neutral"}}]
No markdown, no explanation.
"""

    try:
        raw = call_gemini(prompt)
        tags = parse_json(raw)
        tag_map = {t["id"]: t["sentiment"] for t in tags}

        for row in untagged:
            if row.id in tag_map:
                row.sentiment = tag_map[row.id]
                session.add(row)

        session.commit()
        return {"message": f"Tagged {len(tag_map)} reviews.", "tagged": len(tag_map)}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))