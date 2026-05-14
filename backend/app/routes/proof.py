from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import traceback

from ..database import get_db
from ..models import Proof
from ..schemas import ProofRequest, UploadResponse
from ..services.aptos import aptos_service
from ..config import settings

router = APIRouter(prefix="/api/v1", tags=["Proof"])


@router.post("/proof", response_model=UploadResponse)
async def create_proof(payload: ProofRequest, db: Session = Depends(get_db)):
    try:
        # Check for duplicate
        existing = db.query(Proof).filter(Proof.file_hash == payload.file_hash).first()
        if existing:
            return UploadResponse(
                success=False,
                message="This file already has a proof record.",
                proof=existing,
            )

        # Record on Aptos blockchain (non-fatal if not configured)
        aptos_tx_hash = None
        if settings.APTOS_PRIVATE_KEY and settings.APTOS_MODULE_ADDRESS:
            try:
                aptos_tx_hash = await aptos_service.record_proof(payload.file_hash)
            except Exception as e:
                print(f"Aptos recording skipped: {e}")

        # Save proof to MySQL — hash and metadata only, no user details
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

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
