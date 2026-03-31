from fastapi import APIRouter, Depends, HTTPException, status
from src.models.user import User
from src.schemas.user import CreateUserSchema, UserSchema
from src.services.auth import create_access_token, verify_password, hash_password
from src.services.user import UserService
from src.core.database import get_session
from sqlmodel.ext.asyncio.session import AsyncSession

router = APIRouter()
user_service = UserService()

@router.post("/register", response_model=UserSchema)
async def register(user: CreateUserSchema, session: AsyncSession = Depends(get_session)):
    existing_user = user_service.get_user_by_email(user.email, session)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    hashed_password = hash_password(user.password)
    user.password = hashed_password
    new_user = user_service.create_user(user, session)
    access_token = create_access_token(data={"sub": new_user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/login", response_model=UserSchema)
async def login(user: CreateUserSchema, session: AsyncSession = Depends(get_session)):
    existing_user = user_service.get_user_by_email(user.email, session)
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
    access_token = create_access_token(data={"sub": existing_user.email})
    return {"access_token": access_token, "token_type": "bearer"}
