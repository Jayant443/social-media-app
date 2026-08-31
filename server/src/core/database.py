from sqlmodel import SQLModel
import asyncio
from src.core.config import Config
from sqlalchemy.orm import sessionmaker
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlalchemy.ext.asyncio import create_async_engine
from src.comments.model import Comment
from src.users.model import User
from src.posts.model import Post
from src.votes.model import Vote
from src.communities.model import Community, CommunityMember

engine = create_async_engine(
    url=Config.DB_URL,
    echo=True,
    future=True
)

async def init_db():
    MAX_RETRIES = 20
    for attempt in range(MAX_RETRIES):
        try:
            async with engine.begin() as conn:
                await conn.run_sync(SQLModel.metadata.create_all)
            print("Database connected successfully")
            return
        except Exception as e:
            print(f"Database not ready yet ({attempt+1}/{MAX_RETRIES})")
            print(e)
            await asyncio.sleep(3)
    raise Exception("Could not connect to database")

async def get_session():
    SessionLocal = sessionmaker(
        bind=engine,
        class_=AsyncSession,
        expire_on_commit=False
    )
    async with SessionLocal() as session:
        yield session