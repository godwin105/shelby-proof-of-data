# Shelby Proof-of-Data

> Decentralized, tamper-proof proof-of-existence for any file.
> Files are stored on **Shelby's decentralized network** and their SHA-256 hash + timestamp are permanently anchored on the **Aptos blockchain**.

---

## Project Structure

```
shelby-pod/
├── backend/          # FastAPI + MySQL backend
├── frontend/         # React + Vite frontend
└── contracts/        # Aptos Move smart contract
```

---

## Quick Start

### 1. Backend

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# Fill in all values in .env
uvicorn app.main:app --reload --port 8000
```

API docs → http://localhost:8000/docs

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

App → http://localhost:5173

### 3. Smart Contract

```bash
cd contracts
aptos move compile
aptos move publish --profile devnet
```

Copy the deployed module address into `APTOS_MODULE_ADDRESS` in `backend/.env`.

---

## API Reference

| Method | Path                    | Description                           |
|--------|-------------------------|---------------------------------------|
| POST   | `/api/v1/upload`        | Upload → hash → Shelby → Aptos        |
| GET    | `/api/v1/verify/{hash}` | Verify by SHA-256 hash string         |
| POST   | `/api/v1/verify/file`   | Verify by re-uploading original file  |

---

## Environment Variables (`backend/.env`)

| Variable               | Description                                 |
|------------------------|---------------------------------------------|
| `DATABASE_URL`         | MySQL connection string                     |
| `APTOS_NODE_URL`       | Aptos RPC node URL                          |
| `APTOS_PRIVATE_KEY`    | Hex private key of the recording account    |
| `APTOS_MODULE_ADDRESS` | Deployed Move module address                |
| `SHELBY_API_URL`       | Base URL of Shelby's storage API            |
| `SHELBY_API_KEY`       | API key for Shelby authentication           |
