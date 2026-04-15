from fastapi import APIRouter, Depends, HTTPException, status, Form, File, UploadFile
from fastapi.security import OAuth2PasswordRequestForm
from src.users.model import User
from src.users.schema import CreateUserSchema, LoginUserSchema
from src.auth.service import AuthService
from src.users.service import UserService
from src.core.database import get_session
from sqlmodel.ext.asyncio.session import AsyncSession
from src.utils.image_upload import upload_to_cloudinary
from typing import Optional

auth_router = APIRouter()
user_service = UserService()
auth_service = AuthService()

@auth_router.post("/register")
async def register(username: str = Form(...), email: str = Form(...), avatar: Optional[UploadFile] = File(None), bio: str = Form(None), password: str = Form(...), session: AsyncSession = Depends(get_session)):
    existing_user = await user_service.get_user_by_email(email, session)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    existing_user = await user_service.get_user(username, session)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This username is already taken"
        )
    avatar_url = None
    if avatar:
        avatar_url = await upload_to_cloudinary(await avatar.read())
    user = CreateUserSchema(username=username, email=email, avatar_url=avatar_url, bio=bio, password=password)
    hashed_password = auth_service.hash_password(user.password)
    user.password = hashed_password
    new_user = await user_service.create_user(user, session)
    access_token = await auth_service.create_access_token(data={"sub": new_user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@auth_router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends(), session: AsyncSession = Depends(get_session)):
    user = await auth_service.authenticate_user(form_data.username, form_data.password, session)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"}
        )
    access_token = await auth_service.create_access_token({"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}