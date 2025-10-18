from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import init_db
from .routers import auth, tests

app = FastAPI(title="ASL Teacher Backend")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(tests.router)

# Startup event to initialize DB
@app.on_event("startup")
async def on_startup():
    await init_db()

# Root endpoint
@app.get("/")
def read_root():
    return {"status": "ASL Teacher Backend running"}
