from fastapi import APIRouter, Depends, HTTPException
from .database import AsyncSessionLocal
from .models import User, TestResult, SignAttempt
from sqlalchemy.future import select
from sqlalchemy.exc import IntegrityError

router = APIRouter()

@router.post("/users/")
async def create_user(username: str, email: str):
    async with AsyncSessionLocal() as session:
        user = User(username=username, email=email)
        session.add(user)
        try:
            await session.commit()
        except IntegrityError:
            raise HTTPException(status_code=400, detail="Username or email already exists")
        return {"message": "User created", "user_id": user.user_id}

# Add more routes for test submission, test history, etc...

