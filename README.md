# Shelby Proof-of-Data

Decentralized proof-of-existence for files.

The frontend hashes a selected file in the browser, asks the connected Aptos wallet to sign the Shelby upload transaction, stores the file on Shelby, and saves the resulting proof metadata for later verification.

## Project Structure

```text
shelby-pod/
├── backend/    # FastAPI + MySQL proof lookup API
├── frontend/   # React + Vite wallet-driven proof UI
└── contracts/  # Aptos Move proof contract
```

## Proof Flow

1. User connects an Aptos wallet.
2. User selects a file.
3. Browser computes the SHA-256 hash locally.
4. Wallet approval signs the Shelby upload transaction.
5. Shelby stores the file and returns a blob ID.
6. Frontend captures the wallet transaction hash.
7. Backend independently verifies the Aptos transaction on the configured fullnode.
8. Backend verifies the Shelby blob through the Shelby indexer using wallet owner + blob name.
9. Backend stores the proof metadata through `/api/v1/proof`.
10. User verifies later by hash or original file.

## Quick Start

### Backend

```bash
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
cp .env.example .env
# Fill in all values in .env
uvicorn app.main:app --reload --port 8000
```

API docs: http://localhost:8000/docs

For local phpMyAdmin/XAMPP testing, import `backend/phpmyadmin_local.sql`, then use a local database URL like:

```env
DATABASE_URL=mysql+pymysql://root:@localhost:3306/shelby_pod
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App: http://localhost:5173

Set frontend environment values in `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_SHELBY_API_KEY=your_shelby_api_key
```

### Smart Contract

```bash
cd contracts
aptos move compile
aptos move publish --profile testnet
```

## API Reference

| Method | Path                    | Description                                      |
|--------|-------------------------|--------------------------------------------------|
| POST   | `/api/v1/proof`         | Verify Aptos/Shelby proof, then save metadata    |
| GET    | `/api/v1/verify/{hash}` | Verify by SHA-256 hash string                    |
| POST   | `/api/v1/verify/file`   | Verify by re-uploading the original file         |

## Backend Environment Variables

| Variable         | Description                                      |
|------------------|--------------------------------------------------|
| `DATABASE_URL`   | MySQL connection string                          |
| `APTOS_NODE_URL` | Aptos RPC node URL, defaults to Aptos testnet    |
| `SHELBY_API_URL` | Optional Shelby storage API base URL             |
| `SHELBY_API_KEY` | Optional Shelby API key                          |
| `SHELBY_INDEXER_URL` | Shelby GraphQL indexer used for blob verification |
| `SHELBY_RPC_URL` | Shelby RPC URL for storage operations            |
| `CORS_ORIGINS`   | Comma-separated frontend origins allowed by API  |
