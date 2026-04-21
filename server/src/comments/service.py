from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import select
from src.comments.model import Comment
from src.comments.schema import CommentCreate, CommentUpdate
from uuid import UUID
from src.posts.service import PostService
from typing import Optional
from src.users.model import User

post_service = PostService()

class CommentService:
    async def create_comment(self, author_id: UUID, body: str, session: AsyncSession, post_id: Optional[UUID] = None, parent_id: Optional[UUID] = None) -> Comment:
        comment = CommentCreate(author_id=author_id, post_id=post_id, body=body, parent_id=parent_id)
        comment = Comment(**comment.dict(exclude_unset=True))
        session.add(comment)

        # Increment comment_count on the post
        if post_id:
            from src.posts.model import Post
            result = await session.exec(select(Post).where(Post.id == post_id))
            post = result.first()
            if post:
                post.comment_count += 1
                session.add(post)

        await session.commit()
        await session.refresh(comment)
        return comment

    async def get_comment(self, comment_id: UUID, session: AsyncSession) -> Comment:
        result = await session.exec(select(Comment).where(Comment.id == comment_id))
        return result.first()

    async def get_top_comments(self, post_id: UUID, session: AsyncSession) -> list[dict]:
        result = await session.exec(
            select(Comment, User.username, User.avatar_url)
            .join(User, Comment.author_id == User.id)
            .where(Comment.post_id == post_id, Comment.parent_id == None, Comment.is_deleted == False)
        )
        rows = result.all()
        comments = []
        for comment, username, avatar_url in rows:
            comments.append({
                **comment.dict(),
                "author_username": username,
                "author_avatar_url": avatar_url
            })
        return comments

    async def get_replies(self, parent_id: UUID, session: AsyncSession):
        result = await session.exec(
            select(Comment, User.username, User.avatar_url)
            .join(User, Comment.author_id == User.id)
            .where(Comment.parent_id == parent_id, Comment.is_deleted == False)
        )
        rows = result.all()
        comments = []
        for comment, username, avatar_url in rows:
            comments.append({
                **comment.dict(),
                "author_username": username,
                "author_avatar_url": avatar_url
            })
        return comments

    async def get_reply_count(self, parent_id: UUID, session: AsyncSession):
        result = await self.get_replies(parent_id)
        return len(result)

    async def update_comment(self, author_id: UUID, comment_id: UUID, comment: CommentUpdate, session: AsyncSession) -> Comment:
        comment: Comment = await CommentService.get_comment(session, comment_id)
        if not comment:
            return None
        if comment.author_id != author_id:
            return None
        comment_data = comment.dict(exclude_unset=True)
        for field, value in comment_data.items():
            setattr(comment, field, value)
        session.add(comment)
        await session.commit()
        await session.refresh(comment)
        return comment

    async def delete_comment(self, comment_id: UUID, user_id: UUID, session: AsyncSession) -> bool:
        result = await session.exec(select(Comment).where(Comment.id == comment_id))
        comment = result.first()
        if not comment or comment.author_id != user_id:
            return False
        comment.is_deleted = True
        session.add(comment)
        await session.commit()
        return True

    async def get_comments_by_user(self, user_id: UUID, session: AsyncSession) -> list[Comment]:
        result = await session.exec(select(Comment).where(Comment.author_id == user_id))
        return result.all()
