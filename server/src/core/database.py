from sqlmodel import SQLModel
from src.core.config import Config
from sqlalchemy.orm import sessionmaker
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlalchemy.ext.asyncio import create_async_engine
from src.models.comment import Comment
from src.models.user import User
from src.models.post import Post
from src.models.vote import Vote
from src.models.community import Community, CommunityMember

engine = create_async_engine(
    url=Config.DB_URL,
    echo=True,
    future=True
)

async def init_db():

    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)

async def get_session():
    SessionLocal = sessionmaker(
        bind=engine,
        class_=AsyncSession,
        expire_on_commit=False
    )
    async with SessionLocal() as session:
        yield session