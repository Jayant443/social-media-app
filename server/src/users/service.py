from src.users.schema import CreateUserSchema, UpdateUserSchema
from sqlmodel.ext.asyncio.session import AsyncSession
from uuid import UUID
from typing import Optional, List
from sqlmodel import select, or_
from src.posts.model import Post, SavedPost
from src.comments.model import Comment
from src.communities.model import Community, CommunityMember
from src.users.model import User

class UserService:
    async def get_user(self, username: str, session: AsyncSession) -> Optional[User]:
        result = await session.exec(select(User).where(User.username == username))
        return result.first()

    async def get_user_by_identifier(self, identifier: str, session: AsyncSession) -> Optional[User]:
        result = await session.exec(select(User).where(or_(User.username == identifier, User.email == identifier)))
        return result.first()

    async def get_user_by_id(self, id: UUID, session: AsyncSession) -> Optional[User]:
        result = await session.exec(select(User).where(User.id == id))
        return result.first()

    async def get_user_by_email(self, email: str, session: AsyncSession) -> Optional[User]:
        result = await session.exec(select(User).where(User.email == email))
        return result.first()

    async def create_user(self, user: CreateUserSchema, session: AsyncSession) -> Optional[User]:
        result = await session.exec(select(User).where(User.username == user.username))
        existing = result.first()
        if existing is not None:
            return None
        user_data_dict = user.model_dump()
        db_user = User(**user_data_dict)
        session.add(db_user)
        await session.commit()
        await session.refresh(db_user)
        return db_user

    async def update_user(self, id: UUID, user: UpdateUserSchema, session: AsyncSession) -> Optional[User]:
        db_user = await session.get(User, id)
        if not db_user:
            return None
        user_data = user.dict(exclude_unset=True)
        for key, value in user_data.items():
            setattr(db_user, key, value)
        session.add(db_user)
        await session.commit()
        await session.refresh(db_user)
        return db_user

    async def delete_user(self, id: UUID, session: AsyncSession) -> bool:
        db_user = await session.get(User, id)
        if not db_user:
            return False
        await session.delete(db_user)
        await session.commit()
        return True

    async def get_user_posts(self, id: UUID, session: AsyncSession) -> List[Post]:
        result = await session.exec(select(Post).where(Post.author_id == id))
        return result.all()

    async def get_user_comments(self, id: UUID, session: AsyncSession) -> List[Comment]:
        result = await session.exec(select(Comment).where(Comment.author_id == id))
        return result.all()

    async def get_user_saved_posts(self, id: UUID, session: AsyncSession) -> List[Post]:
        result = await session.exec(select(Post).where(SavedPost.user_id == id))
        return result.all()

    async def get_user_communities(self, id: UUID, session: AsyncSession) -> List[Community]:
        result = await session.exec(select(CommunityMember).where(CommunityMember.user_id == id))
        return result.all()

    async def get_user_created_communities(self, id: UUID, session: AsyncSession) -> List[Community]:
        result = await session.exec(select(Community).where(Community.created_by == id))
        return result.all()
