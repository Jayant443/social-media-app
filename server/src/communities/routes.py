from fastapi import APIRouter, Depends, HTTPException, status, Form, File, UploadFile
from src.communities.schema import CreateCommunitySchema, UpdateCommunitySchema, CommunitySchema, CommunityMemberSchema
from src.communities.service import CommunityService
from src.communities.model import Community
from src.posts.schema import PostSchema
from src.dependencies.auth import get_current_user
from src.utils.image_upload import upload_to_cloudinary
from src.users.model import User
from sqlmodel.ext.asyncio.session import AsyncSession
from src.core.database import get_session
from uuid import UUID
from typing import List, Optional

community_router = APIRouter()
community_service = CommunityService()
@community_router.post("/create", response_model=CommunitySchema, status_code=status.HTTP_201_CREATED)
async def create_community(name: str = Form(...), description: str = Form(None), banner: Optional[UploadFile] = File(None), icon: Optional[UploadFile] = File(None),session: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user)):
    existing = await community_service.get_community_by_name(name, session)
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Community already exists")
    banner_url = None
    icon_url = None
    if banner:
        banner_url = await upload_to_cloudinary(await banner.read())
    if icon:
        icon_url = await upload_to_cloudinary(await icon.read())
    community_data = CreateCommunitySchema(name=name, description=description, banner_url=banner_url, icon_url=icon_url)
    db_community = await community_service.create_community(current_user.id, community_data, session)
    if not db_community:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Community already exists")
    return db_community

@community_router.get("/discover/random", response_model=List[CommunitySchema])
async def get_random_communities(session: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user)):
    return await community_service.get_random_communities(session)

@community_router.get("/{id}", response_model=CommunitySchema)
async def get_community(id: UUID, session: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user)):
    db_community = await community_service.get_community(id, session)
    if not db_community:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Community not found")
    return db_community

@community_router.get("/name/{name}", response_model=CommunitySchema)
async def get_community_by_name(name: str, session: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user)):
    db_community = await community_service.get_community_by_name(name, session)
    if not db_community:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Community not found")
    return db_community

@community_router.patch("/{id}", response_model=CommunitySchema)
async def update_community(id: UUID, description: str = Form(None), banner: Optional[UploadFile] = File(None), icon: Optional[UploadFile] = File(None), session: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user)):
    existing = await community_service.get_community(id, session)
    if not existing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Community not found")
    update_data = {}
    if description is not None:
        update_data["description"] = description
    if banner:
        update_data["banner_url"] = await upload_to_cloudinary(await banner.read())
    if icon:
        update_data["icon_url"] = await upload_to_cloudinary(await icon.read())
    community = UpdateCommunitySchema(**update_data)
    db_community = await community_service.update_community(id, community, session)
    if not db_community:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Community not found")
    return db_community

@community_router.delete("/{id}")
async def delete_community(id: UUID, session: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user)):
    result = await community_service.delete_community(id, session)
    return result

@community_router.post("/{id}/join", response_model=CommunityMemberSchema)
async def join_community(id: UUID, session: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user)):
    db_community_member = await community_service.join_community(current_user.id, id, session)
    if not db_community_member:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Community not found")
    return db_community_member

@community_router.post("/{id}/leave")
async def leave_community(id: UUID, session: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user)):
    result = await community_service.leave_community(current_user.id, id, session)
    return result

@community_router.get("/{id}/members", response_model=List[CommunityMemberSchema])
async def get_community_members(id: UUID, session: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user)):
    db_community_members = await community_service.get_community_members(id, session)
    if not db_community_members:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Members not found")
    return db_community_members

@community_router.get("/{id}/posts", response_model=List[PostSchema])
async def get_community_posts(id: UUID, session: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user)):
    db_community_posts = await community_service.get_community_posts(id, session)
    if not db_community_posts:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Posts not found")
    return db_community_posts

@community_router.get("/{id}/members/count")
async def get_comunity_member_count(id: UUID, session: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user)):
    db_community_members = await community_service.get_community_members(id, session)
    if not db_community_members:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Members not found")
    return len(db_community_members)

@community_router.get("/{id}/posts/count")
async def get_comunity_post_count(id: UUID, session: AsyncSession = Depends(get_session), current_user: User = Depends(get_current_user)):
    db_community_posts = await community_service.get_community_posts(id, session)
    if not db_community_posts:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Posts not found")
    return len(db_community_posts)

