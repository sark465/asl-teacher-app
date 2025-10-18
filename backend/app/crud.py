# crud.py
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from . import models
from .schemas import TestResultCreate

# Create a test result with sign attempts
async def create_test_result(db: AsyncSession, test_data: TestResultCreate):
    # Create the TestResult instance
    db_test = models.TestResult(
        user_id=test_data.user_id,
        total_score=test_data.total_score,
        total_signs=test_data.total_signs,
        percentage=test_data.percentage,
        time_taken=test_data.time_taken,
    )
    db.add(db_test)
    await db.commit()
    await db.refresh(db_test)

    # Add SignAttempt entries
    for attempt in test_data.attempts:
        db_attempt = models.SignAttempt(
            test_id=db_test.test_id,
            sign_name=attempt.sign_name,
            is_correct=attempt.is_correct,
            confidence_score=attempt.confidence_score,
        )
        db.add(db_attempt)
    await db.commit()
    return db_test

# Get all tests for a user
async def get_user_tests(db: AsyncSession, user_id: int):
    result = await db.execute(select(models.TestResult).filter(models.TestResult.user_id == user_id))
    return result.scalars().all()
