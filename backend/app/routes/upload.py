import uuid
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Proof
from ..schemas import UploadResponse
from ..services.aptos import aptos_service
from ..services.hasher import compute_sha256
from ..services.shelby import shelby_service
from ..config import settings

router = APIRouter(prefix="/api/v1", tags=["Upload"])

MAX_FILE_SIZE = 100 * 1024 * 1024  # 100 MB


@router.post("/upload", response_model=UploadResponse)
async def upload_file(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    # 1. Read & validate size
    file_bytes = await file.read()
    if len(file_bytes) > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail="File too large. Max size is 100 MB.")

    # 2. Compute SHA-256 hash
    file_hash = compute_sha256(file_bytes)

    # 3. Check for duplicate proof
    existing = db.query(Proof).filter(Proof.file_hash == file_hash).first()
    if existing:
        return UploadResponse(
            success=False,
            message="This file already has a proof record.",
            proof=existing,
        )

    # 4. Upload to Shelby (non-fatal — falls back to placeholder if unavailable)
    blob_id = None
    blob_url = None
    shelby_warning = None

    if settings.SHELBY_API_URL and settings.SHELBY_API_KEY:
        try:
            blob_meta = await shelby_service.upload_blob(
                file_bytes,
                file.filename or "unknown",
                file.content_type or "application/octet-stream",
            )
            blob_id = blob_meta["blob_id"]
            blob_url = blob_meta.get("blob_url")
        except Exception as exc:
            # Shelby unavailable — use local placeholder so proof still saves
            shelby_warning = f"Shelby upload skipped: {exc}"
            blob_id = f"local-{uuid.uuid4().hex}"
            blob_url = None
    else:
        # No Shelby credentials configured yet
        blob_id = f"local-{uuid.uuid4().hex}"
        shelby_warning = "Shelby not configured — blob stored as local placeholder."

    # 5. Record on Aptos (non-fatal)
    aptos_tx_hash = None
    if settings.APTOS_PRIVATE_KEY and settings.APTOS_MODULE_ADDRESS:
        try:
            aptos_tx_hash = await aptos_service.record_proof(file_hash)
        except Exception:
            pass  # Aptos unavailable — proof still saved locally

    # 6. Persist proof to MySQL
    proof = Proof(
        file_hash=file_hash,
        file_name=file.filename or "unknown",
        file_size=len(file_bytes),
        file_type=file.content_type,
        shelby_blob_id=blob_id,
        shelby_blob_url=blob_url,
        aptos_tx_hash=aptos_tx_hash,
    )
    db.add(proof)
    db.commit()
    db.refresh(proof)

    message = "File proven successfully."
    if shelby_warning:
        message += f" (Note: {shelby_warning})"

    return UploadResponse(success=True, message=message, proof=proof)
