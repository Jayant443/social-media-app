from datetime import datetime, timedelta, timezone
from jose import jwt, JWTError
from src.core.config import Config
from src.users.service import UserService
from sqlmodel.ext.asyncio.session import AsyncSession
import bcrypt
import logging
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
user_service = UserService()

class AuthService:
    def hash_password(self, password: str) -> str:
        return pwd_context.hash(password)

    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        return pwd_context.verify(plain_password, hashed_password)

    async def create_access_token(self, data: dict) -> str:
        expire = datetime.now(timezone.utc) + timedelta(minutes=int(Config.ACCESS_TOKEN_EXPIRE_MINUTES))
        return jwt.encode({**data, "exp": expire}, Config.JWT_SECRET, algorithm=Config.JWT_ALGORITHM)

    async def authenticate_user(self, identifier: str, password: str, session: AsyncSession):
        user = await user_service.get_user_by_identifier(identifier, session)
        if not user:
            return None
        if not self.verify_password(password, user.password):
            return None
        return user

    async def decode_access_token(self, token):
        try:
            decoded_jwt = jwt.decode(token=token, key=Config.JWT_SECRET, algorithms=Config.JWT_ALGORITHM)
            return decoded_jwt
        except JWTError as e:
            logging.exception(e)