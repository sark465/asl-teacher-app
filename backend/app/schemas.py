# schemas.py
from pydantic import BaseModel
from typing import List
from datetime import datetime

# --- User schemas ---
class UserBase(BaseModel):
    name: str

class UserCreate(UserBase):
    password: str  # if you have a password field

class UserRead(UserBase):
    id: int

    model_config = {
        "from_attributes": True  # Pydantic v2
    }

# --- SignAttempt schemas ---
class SignAttemptBase(BaseModel):
    sign_name: str
    is_correct: bool
    confidence_score: float

class SignAttemptCreate(SignAttemptBase):
    pass

class SignAttempt(SignAttemptBase):
    attempt_id: int
    timestamp: datetime

    model_config = {"from_attributes": True}

# --- TestResult schemas ---
class TestResultBase(BaseModel):
    total_score: int
    total_signs: int
    percentage: float
    time_taken: float

class TestResultCreate(TestResultBase):
    user_id: int
    attempts: List[SignAttemptCreate]

class TestResult(TestResultBase):
    test_id: int
    test_date: datetime
    attempts: List[SignAttempt]

    model_config = {"from_attributes": True}
