# models.py
from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from .database import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    password = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)

    tests = relationship("TestResult", back_populates="user")


class TestResult(Base):
    __tablename__ = "test_results"
    test_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    total_score = Column(Integer)
    total_signs = Column(Integer)
    percentage = Column(Float)
    time_taken = Column(Float)
    test_date = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="tests")
    attempts = relationship("SignAttempt", back_populates="test", cascade="all, delete-orphan")


class SignAttempt(Base):
    __tablename__ = "sign_attempts"
    attempt_id = Column(Integer, primary_key=True, index=True)
    test_id = Column(Integer, ForeignKey("test_results.test_id"))
    sign_name = Column(String)
    is_correct = Column(Integer)  # 1/0
    confidence_score = Column(Float)
    timestamp = Column(DateTime, default=datetime.utcnow)

    test = relationship("TestResult", back_populates="attempts")
