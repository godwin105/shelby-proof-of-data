from sqlalchemy import create_engine
from sqlalchemy import inspect, text
from sqlalchemy.orm import declarative_base, sessionmaker
from .config import settings

engine = create_engine(settings.DATABASE_URL, pool_pre_ping=True, pool_recycle=3600)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def ensure_runtime_schema():
    inspector = inspect(engine)
    if "proofs" not in inspector.get_table_names():
        return

    columns = {column["name"] for column in inspector.get_columns("proofs")}
    if "owner_address" not in columns:
        with engine.begin() as connection:
            connection.execute(text("ALTER TABLE proofs ADD COLUMN owner_address VARCHAR(66) NULL"))

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
