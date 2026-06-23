from pydantic import BaseModel, field_validator  # type: ignore[import]
from datetime import datetime
from typing import Optional
import re


SHA256_RE = re.compile(r"^[a-fA-F0-9]{64}$")
APTOS_ADDRESS_RE = re.compile(r"^0x[a-fA-F0-9]{1,64}$")


class ProofRequest(BaseModel):
    """Sent by frontend after Shelby upload + Aptos transaction complete."""
    file_hash:      str
    file_name:      str
    file_size:      int
    file_type:      Optional[str] = None
    owner_address:  str
    shelby_blob_id: str
    shelby_blob_url: Optional[str] = None
    aptos_tx_hash:  Optional[str] = None  # Real tx hash from Shelby SDK

    @field_validator("file_hash")
    @classmethod
    def validate_file_hash(cls, value: str) -> str:
        value = value.strip()
        if not SHA256_RE.fullmatch(value):
            raise ValueError("file_hash must be a 64-character SHA-256 hex string")
        return value.lower()

    @field_validator("owner_address")
    @classmethod
    def validate_owner_address(cls, value: str) -> str:
        value = value.strip()
        if not APTOS_ADDRESS_RE.fullmatch(value):
            raise ValueError("owner_address must be an Aptos account address")
        return "0x" + value[2:].lower()

    @field_validator("file_name", "shelby_blob_id")
    @classmethod
    def validate_required_text(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("value cannot be empty")
        return value

    @field_validator("file_size")
    @classmethod
    def validate_file_size(cls, value: int) -> int:
        if value < 0:
            raise ValueError("file_size cannot be negative")
        return value

    @field_validator("file_type", "shelby_blob_url", "aptos_tx_hash")
    @classmethod
    def normalize_optional_text(cls, value: Optional[str]) -> Optional[str]:
        if value is None:
            return None
        value = value.strip()
        return value or None


class ProofResponse(BaseModel):
    id:             int
    file_hash:      str
    file_name:      str
    file_size:      int
    file_type:      Optional[str] = None
    owner_address:  Optional[str] = None
    shelby_blob_id: str
    shelby_blob_url: Optional[str] = None
    aptos_tx_hash:  Optional[str] = None
    timestamp:      datetime

    class Config:
        from_attributes = True


class UploadResponse(BaseModel):
    success: bool
    message: str
    proof:   ProofResponse


class VerifyResponse(BaseModel):
    exists:  bool
    message: str
    proof:   Optional[ProofResponse] = None
