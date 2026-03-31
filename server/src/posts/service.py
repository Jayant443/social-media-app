from sqlmodel.ext.asyncio.session import AsyncSession
from uuid import UUID
from typing import Optional, List
from sqlmodel import select
from src.posts.model import Post, SavedPost
from src.posts.schema import CreatePostSchema, UpdatePostSchema, PostSchema, SavedPostSchema, SavePostSchema

class PostService:
    async def create_post(self, post: CreatePostSchema, session: AsyncSession) -> Optional[Post]:
        post_data = Post(**post.dict())
        session.add(post_data)
        await session.commit()
        await session.refresh(post_data)
        return post_data

    async def get_post(self, id: UUID, session: AsyncSession) -> Optional[Post]:
        result = await session.exec(select(Post).where(Post.id == id))
        return result.first()

    async def edit_post(self, id: UUID, post: UpdatePostSchema, session: AsyncSession) -> Optional[Post]:
        db_post = await session.get(Post, id)
        if not db_post:
            return None
        post_data = post.dict(exclude_unset=True)
        for key, value in post_data.items():
            setattr(db_post, key, value)
        session.add(db_post)
        await session.commit()
        await session.refresh(db_post)
        return db_post

    async def delete_post(self, id: UUID, session: AsyncSession) -> Optional[Post]:
        db_post = await session.get(Post, id)
        if not db_post:
            return None
        db_post.is_deleted = True
        session.add(db_post)
        await session.commit()
        await session.refresh(db_post)
        return db_post

    async def save_post(self, post: SavePostSchema, session: AsyncSession) -> Optional[Post]:
        db_post = await session.get(SavedPost, post.id)
        if not db_post:
            return None
        post_data_dict = post.model_dump()
        post_data_dict["is_deleted"] = False
        saved_post = SavedPost(**post_data_dict)
        session.add(saved_post)
        await session.commit()
        await session.refresh(saved_post)
        return saved_post

    async def unsave_post(self, id: UUID, session: AsyncSession):
        db_post = await session.get(SavedPost, id)
        if not db_post:
            return None
        session.delete(db_post)
        await session.commit()
        return True
