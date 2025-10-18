from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.future import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
from ..database import AsyncSessionLocal
from ..models import TestResult, SignAttempt
from pydantic import BaseModel
from typing import List
from datetime import datetime

router = APIRouter(prefix="/tests", tags=["Tests"])

# -----------------------------
# Pydantic Schemas
# -----------------------------
class SignAttemptCreate(BaseModel):
    sign_name: str
    is_correct: bool
    confidence_score: float

class TestResultCreate(BaseModel):
    user_id: int
    total_score: int
    total_signs: int
    percentage: float
    time_taken: float
    attempts: List[SignAttemptCreate]


# -----------------------------
# POST /tests/submit
# -----------------------------
@router.post("/submit")
async def submit_test_result(test_data: TestResultCreate):
    async with AsyncSessionLocal() as session:
        try:
            test_result = TestResult(
                user_id=test_data.user_id,
                total_score=test_data.total_score,
                total_signs=test_data.total_signs,
                percentage=test_data.percentage,
                time_taken=test_data.time_taken,
                test_date=datetime.utcnow(),
            )
            session.add(test_result)
            await session.flush()  # ensures test_id is available

            for attempt in test_data.attempts:
                sign_attempt = SignAttempt(
                    test_id=test_result.test_id,
                    sign_name=attempt.sign_name,
                    is_correct=attempt.is_correct,
                    confidence_score=attempt.confidence_score,
                )
                session.add(sign_attempt)

            await session.commit()
            return {"message": "Test result saved successfully", "test_id": test_result.test_id}

        except IntegrityError:
            await session.rollback()
            raise HTTPException(status_code=400, detail="Error saving test result")


# -----------------------------
# GET /tests/user/{user_id}
# -----------------------------
@router.get("/user/{user_id}")
async def get_user_tests(user_id: int):
    async with AsyncSessionLocal() as session:
        result = await session.execute(select(TestResult).where(TestResult.user_id == user_id))
        tests = result.scalars().all()

        if not tests:
            raise HTTPException(status_code=404, detail="No tests found for this user")

        test_list = []
        for test in tests:
            # Fetch attempts for each test
            attempts_result = await session.execute(
                select(SignAttempt).where(SignAttempt.test_id == test.test_id)
            )
            attempts = attempts_result.scalars().all()
            test_list.append({
                "test_id": test.test_id,
                "test_date": test.test_date,
                "total_score": test.total_score,
                "total_signs": test.total_signs,
                "percentage": test.percentage,
                "time_taken": test.time_taken,
                "attempts": [
                    {
                        "sign_name": a.sign_name,
                        "is_correct": a.is_correct,
                        "confidence_score": a.confidence_score
                    }
                    for a in attempts
                ]
            })

        return test_list
