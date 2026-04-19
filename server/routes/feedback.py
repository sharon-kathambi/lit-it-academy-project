from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List
from datetime import datetime, timedelta

from database import get_session
from models import Feedback, FeedbackCreate, FeedbackRead

router = APIRouter(prefix="/api/feedback", tags=["feedback"])


@router.post("/", response_model=FeedbackRead)
def submit_feedback(payload: FeedbackCreate, session: Session = Depends(get_session)):
    feedback = Feedback.from_orm(payload)
    session.add(feedback)
    session.commit()
    session.refresh(feedback)
    return feedback


@router.get("/", response_model=List[FeedbackRead])
def get_feedback(
    days: int = 30,
    limit: int = 100,
    session: Session = Depends(get_session)
):
    since = datetime.utcnow() - timedelta(days=days)
    results = session.exec(
        select(Feedback)
        .where(Feedback.created_at >= since)
        .order_by(Feedback.created_at.desc())
        .limit(limit)
    ).all()
    return results


@router.get("/stats")
def get_stats(days: int = 30, session: Session = Depends(get_session)):
    since = datetime.utcnow() - timedelta(days=days)
    rows = session.exec(
        select(Feedback).where(Feedback.created_at >= since)
    ).all()

    if not rows:
        return {"total": 0, "avg_food": 0, "avg_service": 0, "avg_overall": 0}

    total = len(rows)
    return {
        "total": total,
        "avg_food": round(sum(r.food_rating for r in rows) / total, 1),
        "avg_service": round(sum(r.service_rating for r in rows) / total, 1),
        "avg_overall": round(sum(r.overall_rating for r in rows) / total, 1),
        "sentiment_counts": {
            "positive": sum(1 for r in rows if r.sentiment == "positive"),
            "neutral":  sum(1 for r in rows if r.sentiment == "neutral"),
            "negative": sum(1 for r in rows if r.sentiment == "negative"),
        }
    }