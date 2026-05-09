from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Proof
from ..schemas import ProofRequest, UploadResponse
from ..services.aptos import aptos_service
from ..config import settings

router = APIRouter(prefix="/api/v1", tags=["Proof"])


@router.post("/proof", response_model=UploadResponse)
async def create_proof(payload: ProofRequest, db: Session = Depends(get_db)):
    """
    Called by the frontend after it has uploaded the blob to Shelby.
    Records the hash on Aptos and persists the proof to MySQL.
    """
    # Check for duplicate
    existing = db.query(Proof).filter(Proof.file_hash == payload.file_hash).first()
    if existing:
        return UploadResponse(
            success=False,
            message="This file already has a proof record.",
            proof=existing,
        )

    # Record on Aptos (non-fatal)
    aptos_tx_hash = None
    if settings.APTOS_PRIVATE_KEY and settings.APTOS_MODULE_ADDRESS:
        try:
            aptos_tx_hash = await aptos_service.record_proof(payload.file_hash)
        except Exception:
            pass

    # Save to MySQL
    proof = Proof(
        file_hash=payload.file_hash,
        file_name=payload.file_name,
        file_size=payload.file_size,
        file_type=payload.file_type,
        shelby_blob_id=payload.shelby_blob_id,
        shelby_blob_url=payload.shelby_blob_url,
        aptos_tx_hash=aptos_tx_hash,
    )
    db.add(proof)
    db.commit()
    db.refresh(proof)

    return UploadResponse(
        success=True,
        message="Proof recorded successfully.",
        proof=proof,
    )
