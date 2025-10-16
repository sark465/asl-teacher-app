from sqlalchemy.exc import IntegrityError
from sqlmodel import select
from .models import User, TestResult, SignAttempt
from .database import engine, get_session
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from datetime import datetime

pwd_ctx = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_user_by_username(session: Session, username: str):
    return session.exec(select(User).where(User.username == username)).first()

def create_user(session: Session, username: str, email: str, password: str):
    hashed = pwd_ctx.hash(password)
    user = User(username=username, email=email, hashed_password=hashed)
    session.add(user)
    try:
        session.commit()
        session.refresh(user)
        return user
    except IntegrityError:
        session.rollback()
        return None

def verify_password(plain, hashed):
    return pwd_ctx.verify(plain, hashed)

def create_test_result(session: Session, user_id: int, time_taken: float, attempts: list):
    total = sum(1 for a in attempts if a["is_correct"])
    total_signs = len(attempts)
    percentage = (total / total_signs) * 100 if total_signs else 0.0
    test = TestResult(user_id=user_id, total_score=total, total_signs=total_signs, percentage=percentage, time_taken=time_taken)
    session.add(test)
    session.commit()
    session.refresh(test)
    # create attempts
    for a in attempts:
        att = SignAttempt(test_id=test.test_id, sign_name=a["sign_name"], is_correct=a["is_correct"], confidence_score=a.get("confidence_score", 0.0))
        session.add(att)
    session.commit()
    session.refresh(test)
    return test

def get_tests_for_user(session: Session, user_id: int):
    return session.exec(select(TestResult).where(TestResult.user_id == user_id)).all()
