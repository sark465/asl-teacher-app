from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserRead(BaseModel):
    user_id: int
    username: str
    email: EmailStr
    created_at: datetime

class SignAttemptCreate(BaseModel):
    sign_name: str
    is_correct: bool
    confidence_score: float
    timestamp: Optional[datetime] = None

class TestCreate(BaseModel):
    user_id: int
    time_taken: Optional[float] = None
    attempts: List[SignAttemptCreate]

class TestRead(BaseModel):
    test_id: int
    user_id: int
    test_date: datetime
    total_score: int
    total_signs: int
    percentage: float
    time_taken: Optional[float]
