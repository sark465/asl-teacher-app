from fastapi import FastAPI
from .database import init_db
from .routers import auth, tests
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI(title="ASL Teacher Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(tests.router)

@app.on_event("startup")
def on_startup():
    init_db()

@app.get("/")
def read_root():
    return {"status": "ASL Teacher Backend running"}
