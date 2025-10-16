from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from ..database import get_session
from .. import crud, schemas

router = APIRouter(prefix="/tests", tags=["tests"])

@router.post("/", response_model=schemas.TestRead)
def create_test(test: schemas.TestCreate, session: Session = Depends(get_session)):
    user = session.get(crud.User, test.user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    created = crud.create_test_result(session, test.user_id, test.time_taken, [a.dict() for a in test.attempts])
    return created

@router.get("/user/{user_id}")
def get_user_tests(user_id: int, session: Session = Depends(get_session)):
    results = crud.get_tests_for_user(session, user_id)
    return results
