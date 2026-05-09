from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    DATABASE_URL: str

    # Aptos — optional at startup; required only when submitting transactions
    APTOS_NODE_URL: str = "https://fullnode.devnet.aptoslabs.com/v1"
    APTOS_PRIVATE_KEY: Optional[str] = None
    APTOS_MODULE_ADDRESS: Optional[str] = None

    # Shelby Storage
    SHELBY_API_URL: Optional[str] = None
    SHELBY_API_KEY: Optional[str] = None

    class Config:
        env_file = ".env"


settings = Settings()
