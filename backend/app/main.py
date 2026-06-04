from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import get_cors_origins
from .database import Base, engine, ensure_runtime_schema
from .routes import proof, verify

Base.metadata.create_all(bind=engine)
ensure_runtime_schema()

app = FastAPI(
    title="Shelby Proof-of-Data API",
    description="Decentralized proof-of-existence: Shelby storage + Aptos blockchain.",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=get_cors_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(proof.router)
app.include_router(verify.router)


@app.get("/", tags=["Health"])
def root():
    return {"status": "ok", "service": "Shelby Proof-of-Data API v2.0.0"}
