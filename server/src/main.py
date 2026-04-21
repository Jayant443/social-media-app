from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from src.core.database import init_db
from src.users.routes import user_router
from src.posts.routes import post_router
from src.comments.routes import comment_router
from src.votes.routes import vote_router
from src.communities.routes import community_router
from src.auth.routes import auth_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield

app = FastAPI(title="social media app", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_router, prefix=f"/users", tags=["user"])
app.include_router(auth_router, prefix=f"/auth", tags=["auth"])
app.include_router(community_router, prefix=f"/r", tags=["r"])
app.include_router(post_router, prefix=f"/posts", tags=["post"])
app.include_router(comment_router, prefix=f"/comments", tags=["comments"])
app.include_router(vote_router, prefix=f"/votes", tags=["votes"])

@app.get("/")
async def root():
    return {"status": "ok"}