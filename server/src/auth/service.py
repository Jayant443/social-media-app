from jose import JWTError, jwt
from datetime import datetime, timezone, timedelta
from src.core.config import Config
import logging
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

async def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expires = datetime.now(timezone.utc) + expires_delta if expires_delta else datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expires})
    encoded_jwt = jwt.encode(to_encode, Config.JWT_SECRET, Config.JWT_ALGORITHM)
    return encoded_jwt

async def decode_access_token(token):
    try:
        decoded_jwt = jwt.decode(token=token, key=Config.JWT_SECRET, algorithms=Config.JWT_ALGORITHM)
        return decoded_jwt
    except JWTError as e:
        logging.exception(e)
