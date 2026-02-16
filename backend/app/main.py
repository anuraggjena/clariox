from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routes import auth, posts, ai
from .database import engine, Base

app = FastAPI(title="ClarioX API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite frontend
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables automatically
Base.metadata.create_all(bind=engine)

app.include_router(auth.router)
app.include_router(posts.router)
app.include_router(ai.router)


@app.get("/")
def root():
    return {"message": "ClarioX Backend Running"}
