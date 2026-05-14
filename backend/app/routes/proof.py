from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import traceback

from ..database import get_db
from ..models import Proof
from ..schemas import ProofRequest, UploadResponse

router = APIRouter(prefix="/api/v1", tags=["Proof"])


@router.post("/proof", response_model=UploadResponse)
async def create_proof(payload: ProofRequest, db: Session = Depends(get_db)):
    """
    Receives proof metadata from the frontend after:
    1. File uploaded to Shelby (frontend)
    2. Aptos transaction signed by user's wallet (frontend)

    Backend saves the proof to MySQL for fast lookup and verification.
    No private keys used — everything signed on the frontend by the user.
    """
    try:
        # Check for duplicate proof
        existing = db.query(Proof).filter(Proof.file_hash == payload.file_hash).first()
        if existing:
            return UploadResponse(
                success=False,
                message="This file already has a proof record.",
                proof=existing,
            )

        # Save proof — aptos_tx_hash comes from the Shelby SDK upload response
        proof = Proof(
            file_hash=payload.file_hash,
            file_name=payload.file_name,
            file_size=payload.file_size,
            file_type=payload.file_type,
            shelby_blob_id=payload.shelby_blob_id,
            shelby_blob_url=payload.shelby_blob_url,
            aptos_tx_hash=payload.aptos_tx_hash,
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
