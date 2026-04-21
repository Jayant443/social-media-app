from sqlmodel.ext.asyncio.session import AsyncSession
from uuid import UUID
from typing import Optional, List
from sqlmodel import select
from sqlalchemy.sql import desc
from src.communities.model import Community
from src.users.model import User
from src.posts.model import Post, SavedPost
from src.posts.schema import CreatePostSchema, UpdatePostSchema, PostSchema, SavedPostSchema, SavePostSchema

class PostService:
    async def create_post(self, author_id: UUID, community_id: UUID, post: CreatePostSchema, session: AsyncSession) -> Optional[Post]:
        post_data_dict = post.dict(exclude_unset=True)
        post_data_dict["author_id"] = author_id
        post_data_dict["community_id"] = community_id
        post_data = Post(**post_data_dict)
        session.add(post_data)
        await session.commit()
        await session.refresh(post_data)
        return post_data

    async def get_post(self, id: UUID, session: AsyncSession) -> Optional[dict]:
        result = await session.exec(
            select(Post, User.username, User.avatar_url, Community.name)
            .join(User, Post.author_id == User.id)
            .join(Community, Post.community_id == Community.id)
            .where(Post.id == id)
        )
        row = result.first()
        if not row:
            return None
        post, username, avatar_url, community_name = row
        return {
            **post.dict(),
            "author_username": username,
            "author_avatar_url": avatar_url,
            "community_name": community_name
        }
    
    async def get_recent_posts(self, session: AsyncSession):
        result = await session.exec(select(Post, User.username, User.avatar_url, Community.name).join(User, Post.author_id == User.id).join(Community, Post.community_id == Community.id).order_by(Post.created_at.desc()))
        rows = result.all()
        posts = []
        for post, username, avatar_url, community_name in rows:
            posts.append({
                **post.dict(),
                "author_username": username,
                "author_avatar_url": avatar_url,
                "community_name": community_name
            })
        return posts
    async def edit_post(self, id: UUID, post: UpdatePostSchema, session: AsyncSession) -> Optional[Post]:
        db_post = await session.get(Post, id)
        if not db_post or db_post.is_deleted:
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

    async def save_post(self, user_id: UUID, post: SavePostSchema, session: AsyncSession) -> Optional[SavedPost]:
        result = await session.exec(select(SavedPost).where(SavedPost.user_id == user_id, SavedPost.post_id == post.post_id))
        existing_saved_post = result.first()
        if existing_saved_post:
            return None
        post_data_dict = post.model_dump()
        post_data_dict["user_id"] = user_id
        saved_post = SavedPost(**post_data_dict)
        session.add(saved_post)
        await session.commit()
        await session.refresh(saved_post)
        return saved_post

    async def unsave_post(self, user_id: UUID, post_id: UUID, session: AsyncSession):
        result = await session.exec(select(SavedPost).where(SavedPost.user_id == user_id, SavedPost.post_id == post_id))
        db_post = result.first()
        if not db_post:
            return None
        await session.delete(db_post)
        await session.commit()
        return True
    
    async def get_saved_post_ids(self, user_id: UUID, session: AsyncSession) -> List[UUID]:
        result = await session.exec(select(SavedPost.post_id).where(SavedPost.user_id == user_id))
        return result.all()

    async def get_saved_posts(self, user_id: UUID, session: AsyncSession):
        result = await session.exec(select(Post, User.username, User.avatar_url, Community.name).join(SavedPost, SavedPost.post_id == Post.id).join(User, Post.author_id == User.id).join(Community, Post.community_id == Community.id).where(SavedPost.user_id == user_id).order_by(SavedPost.saved_at.desc()))
        rows = result.all()
        posts = []
        for post, username, avatar_url, community_name in rows:
            posts.append({
                **post.dict(),
                "author_username": username,
                "author_avatar_url": avatar_url,
                "community_name": community_name
            })
        return posts
