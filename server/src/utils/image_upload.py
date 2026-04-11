import cloudinary
import cloudinary.uploader
import asyncio
from src.core.config import Config

async def upload_to_cloudinary(image_bytes: bytes) -> str:
    cloudinary.config(cloud_name=Config.CLOUDINARY_CLOUD_NAME, api_key=Config.CLOUDINARY_API_KEY, api_secret=Config.CLOUDINARY_API_SECRET)
    result = await asyncio.to_thread(cloudinary.uploader.upload, image_bytes)
    return result["secure_url"]
