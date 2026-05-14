from sqlalchemy import Column, String, DateTime, BigInteger
from sqlalchemy.sql import func
from .database import Base


class Proof(Base):
    __tablename__ = "proofs"

    id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)
    file_hash = Column(String(64), unique=True, index=True, nullable=False)
    file_name = Column(String(255), nullable=False)
    file_size = Column(BigInteger, nullable=False)
    file_type = Column(String(100), nullable=True)
    shelby_blob_id = Column(String(255), nullable=False)
    shelby_blob_url = Column(String(512), nullable=True)
    aptos_tx_hash = Column(String(100), nullable=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    created_at = Column(DateTime(timezone=True), server_default=func.now())
