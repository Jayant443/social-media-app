from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import select
from src.models.comment import Comment
from src.schemas.comment import CommentCreate, CommentUpdate
from uuid import UUID

class CommentService:
    async def create_comment(comment: CommentCreate, session: AsyncSession) -> Comment:
        comment = Comment(**comment.dict())
        session.add(comment)
        await session.commit()
        await session.refresh(comment)
        return comment

    async def get_comment(comment_id: UUID, session: AsyncSession) -> Comment:
        result = await session.exec(select(Comment).where(Comment.id == comment_id))
        return result.first()

    async def get_comments_by_post(post_id: UUID, session: AsyncSession) -> list[Comment]:
        result = await session.exec(select(Comment).where(Comment.post_id == post_id))
        return result.all()

    async def update_comment(author_id: UUID, comment_id: UUID, comment: CommentUpdate, session: AsyncSession) -> Comment:
        comment = await CommentService.get_comment(session, comment_id)
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

    async def delete_comment(comment_id: UUID, session: AsyncSession) -> bool:
        comment = await CommentService.get_comment(session, comment_id)
        if not comment:
            return False
        comment.is_deleted = True
        session.add(comment)
        await session.commit()
        return True

    async def get_comments_by_user(user_id: UUID, session: AsyncSession) -> list[Comment]:
        result = await session.exec(select(Comment).where(Comment.author_id == user_id))
        return result.all()
