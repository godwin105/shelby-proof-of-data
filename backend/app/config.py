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

    class Config:
        env_file = ".env"


settings = Settings()
