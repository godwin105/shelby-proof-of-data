from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class ProofRequest(BaseModel):
    file_hash: str
    file_name: str
    file_size: int
    file_type: Optional[str] = None
    shelby_blob_id: str
    shelby_blob_url: Optional[str] = None


class ProofResponse(BaseModel):
    id: int
    file_hash: str
    file_name: str
    file_size: int
    file_type: Optional[str] = None
    shelby_blob_id: str
    shelby_blob_url: Optional[str] = None
    aptos_tx_hash: Optional[str] = None
    timestamp: datetime

    class Config:
        from_attributes = True


class UploadResponse(BaseModel):
    success: bool
    message: str
    proof: ProofResponse


class VerifyResponse(BaseModel):
    exists: bool
    message: str
    proof: Optional[ProofResponse] = None
