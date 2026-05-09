from fastapi import APIRouter, Depends, File, UploadFile
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Proof
from ..schemas import VerifyResponse
from ..services.hasher import compute_sha256

router = APIRouter(prefix="/api/v1", tags=["Verify"])

@router.get("/verify/{file_hash}", response_model=VerifyResponse)
async def verify_by_hash(file_hash: str, db: Session = Depends(get_db)):
    proof = db.query(Proof).filter(Proof.file_hash == file_hash).first()
    if not proof:
        return VerifyResponse(exists=False, message="No proof found for this hash.")
    return VerifyResponse(exists=True, message="Proof verified successfully.", proof=proof)

@router.post("/verify/file", response_model=VerifyResponse)
async def verify_by_file(file: UploadFile = File(...), db: Session = Depends(get_db)):
    file_bytes = await file.read()
    file_hash = compute_sha256(file_bytes)
    proof = db.query(Proof).filter(Proof.file_hash == file_hash).first()
    if not proof:
        return VerifyResponse(exists=False, message="No proof found. File not registered.")
    return VerifyResponse(exists=True, message="Proof verified successfully.", proof=proof)
