from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from ..database import get_session
from .. import crud, schemas



router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=schemas.UserRead)
def register(user: schemas.UserCreate, session: Session = Depends(get_session)):
    new = crud.create_user(session, user.username, user.email, user.password)
    if not new:
        raise HTTPException(status_code=400, detail="Username or email already exists")
    return new

@router.post("/login")
def login(payload: dict, session: Session = Depends(get_session)):
    # For brevity: simple username & password check returning success or fail.
    username = payload.get("username")
    password = payload.get("password")
    user = crud.get_user_by_username(session, username)
    if not user or not crud.verify_password(password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"message": "ok", "user_id": user.user_id}
