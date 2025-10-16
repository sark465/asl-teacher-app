from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from datetime import datetime

class User(SQLModel, table=True):
    user_id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(index=True, unique=True)
    email: str = Field(index=True, unique=True)
    hashed_password: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    test_results: List["TestResult"] = Relationship(back_populates="user")

class TestResult(SQLModel, table=True):
    test_id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.user_id")
    test_date: datetime = Field(default_factory=datetime.utcnow)
    total_score: int = 0
    total_signs: int = 10
    percentage: float = 0.0
    time_taken: Optional[float] = None

    user: Optional[User] = Relationship(back_populates="test_results")
    attempts: List["SignAttempt"] = Relationship(back_populates="test")

class SignAttempt(SQLModel, table=True):
    attempt_id: Optional[int] = Field(default=None, primary_key=True)
    test_id: Optional[int] = Field(default=None, foreign_key="testresult.test_id")
    sign_name: str
    is_correct: bool
    confidence_score: float
    timestamp: datetime = Field(default_factory=datetime.utcnow)

    test: Optional[TestResult] = Relationship(back_populates="attempts")
