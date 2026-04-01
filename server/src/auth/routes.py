from fastapi import APIRouter, Depends, HTTPException, status
from src.users.model import User
from src.users.schema import CreateUserSchema
from src.auth.service import create_access_token, verify_password, hash_password
from src.users.service import UserService
from src.core.database import get_session
from sqlmodel.ext.asyncio.session import AsyncSession

auth_router = APIRouter()
user_service = UserService()

@auth_router.post("/register")
async def register(user: CreateUserSchema, session: AsyncSession = Depends(get_session)):
    existing_user = await user_service.get_user_by_email(user.email, session)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    hashed_password = hash_password(user.password)
    user.password = hashed_password
    new_user = await user_service.create_user(user, session)
    access_token = await create_access_token(data={"sub": new_user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@auth_router.post("/login")
async def login(user: CreateUserSchema, session: AsyncSession = Depends(get_session)):
    existing_user = await user_service.get_user_by_email(user.email, session)
    if not existing_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    if not verify_password(user.password, existing_user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    access_token = await create_access_token(data={"sub": existing_user.email})
    return {"access_token": access_token, "token_type": "bearer"}
