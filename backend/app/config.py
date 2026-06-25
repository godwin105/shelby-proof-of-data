from pydantic_settings import BaseSettings
from pydantic import field_validator
from typing import Optional


class Settings(BaseSettings):
    # PostgreSQL — Supabase/Render provide "postgres://..." but SQLAlchemy needs "postgresql://..."
    DATABASE_URL: str

    @field_validator("DATABASE_URL", mode="before")
    @classmethod
    def fix_pg_scheme(cls, v: str) -> str:
        # Supabase/Render give "postgres://..." — normalise to psycopg v3 dialect
        if v.startswith("postgres://"):
            return "postgresql+psycopg://" + v[len("postgres://"):]
        if v.startswith("postgresql://"):
            return "postgresql+psycopg://" + v[len("postgresql://"):]
        return v

    # Aptos node — testnet
    APTOS_NODE_URL: str = "https://fullnode.testnet.aptoslabs.com/v1"

    # Shelby decentralized storage
    SHELBY_API_URL: Optional[str] = None
    SHELBY_API_KEY: Optional[str] = None
    SHELBY_INDEXER_URL: str = "https://api.testnet.aptoslabs.com/nocode/v1/public/alias/shelby/testnet/v1/graphql"
    SHELBY_RPC_URL: str = "https://api.testnet.shelby.xyz/shelby"

    # Frontend origins allowed to call the API.
    # Example: https://your-app.vercel.app,http://localhost:5173
    CORS_ORIGINS: str = "http://localhost:5173"

    class Config:
        env_file = ".env"


settings = Settings()


def get_cors_origins() -> list[str]:
    return [origin.strip() for origin in settings.CORS_ORIGINS.split(",") if origin.strip()]
