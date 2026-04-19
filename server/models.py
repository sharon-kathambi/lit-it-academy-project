from typing import Optional
from datetime import datetime
from sqlmodel import SQLModel, Field


class FeedbackBase(SQLModel):
    food_rating: int = Field(ge=1, le=5)
    service_rating: int = Field(ge=1, le=5)
    overall_rating: int = Field(ge=1, le=5)
    comment: Optional[str] = None


class Feedback(FeedbackBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    sentiment: Optional[str] = None  # "positive" | "neutral" | "negative"
    created_at: datetime = Field(default_factory=datetime.utcnow)


class FeedbackCreate(FeedbackBase):
    pass


class FeedbackRead(FeedbackBase):
    id: int
    sentiment: Optional[str]
    created_at: datetime