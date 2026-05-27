from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # MySQL
    DATABASE_URL: str

    # Aptos node — testnet
    APTOS_NODE_URL: str = "https://fullnode.testnet.aptoslabs.com/v1"

    # Shelby decentralized storage
    SHELBY_API_URL: Optional[str] = None
    SHELBY_API_KEY: Optional[str] = None

    # Frontend origins allowed to call the API.
    # Example: https://your-app.vercel.app,http://localhost:5173
    CORS_ORIGINS: str = "http://localhost:5173"

    class Config:
        env_file = ".env"


settings = Settings()


def get_cors_origins() -> list[str]:
    return [origin.strip() for origin in settings.CORS_ORIGINS.split(",") if origin.strip()]
