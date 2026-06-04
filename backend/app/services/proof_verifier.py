import re
import asyncio
from typing import Optional

import httpx

from ..config import settings


HEX_64_RE = re.compile(r"^(0x)?[a-fA-F0-9]{64}$")


def _normalize_address(address: str) -> str:
    raw = address.strip().lower()
    if raw.startswith("0x"):
        raw = raw[2:]
    return "0x" + raw.rjust(64, "0")


def _blob_key(owner_address: str, blob_name: str) -> str:
    owner = _normalize_address(owner_address)[2:]
    return f"@{owner}/{blob_name}"


def _normalize_tx_hash(tx_hash: str) -> str:
    raw = tx_hash.strip()
    if not HEX_64_RE.fullmatch(raw):
        raise ValueError("aptos_tx_hash must be a 64-byte hex transaction hash")
    return raw if raw.startswith("0x") else f"0x{raw}"


def _is_truthy_flag(value) -> bool:
    return str(value).lower() in {"1", "true"}


def _is_deleted_flag(value) -> bool:
    return str(value).lower() in {"1", "true"}


def _http_error_message(service: str, exc: httpx.HTTPStatusError) -> str:
    body = exc.response.text[:300] if exc.response is not None else ""
    status = exc.response.status_code if exc.response is not None else "unknown"
    if status in {401, 403}:
        return f"{service} rejected the request. Check your API key and network settings."
    if status == 404:
        return f"{service} record was not found on the configured network."
    return f"{service} verification failed with HTTP {status}: {body}"


class ProofVerifier:
    async def verify_aptos_transaction(self, tx_hash: Optional[str], owner_address: str) -> dict:
        if not tx_hash:
            raise ValueError("Aptos transaction hash is required for anchored proofs.")

        normalized_hash = _normalize_tx_hash(tx_hash)
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(f"{settings.APTOS_NODE_URL.rstrip('/')}/transactions/by_hash/{normalized_hash}")
                if response.status_code == 404:
                    raise ValueError("Aptos transaction was not found on the configured network.")
                response.raise_for_status()
        except httpx.HTTPStatusError as exc:
            raise ValueError(_http_error_message("Aptos", exc)) from exc
        except httpx.RequestError as exc:
            raise ValueError(f"Could not reach Aptos fullnode: {exc}") from exc

        tx = response.json()
        if not tx.get("success"):
            raise ValueError("Aptos transaction exists but did not execute successfully.")

        expected_sender = _normalize_address(owner_address)
        tx_sender = tx.get("sender")
        if tx_sender and _normalize_address(tx_sender) != expected_sender:
            raise ValueError("Aptos transaction sender does not match the connected wallet.")

        return {
            "hash": normalized_hash,
            "sender": tx_sender,
            "version": tx.get("version"),
            "timestamp": tx.get("timestamp"),
        }

    async def verify_shelby_blob(
        self,
        owner_address: str,
        blob_name: str,
        file_size: int,
        aptos_tx_hash: Optional[str],
    ) -> dict:
        full_blob_name = _blob_key(owner_address, blob_name)
        headers = {"x-aptos-client": "shelby-proof-of-data"}
        if settings.SHELBY_API_KEY:
            headers["Authorization"] = f"Bearer {settings.SHELBY_API_KEY}"

        query = """
        query VerifyShelbyBlob($blobName: String!, $txHash: String) {
          blobs(where: {blob_name: {_eq: $blobName}}, limit: 1) {
            owner
            blob_name
            size
            is_deleted
            is_written
          }
          blob_activities(where: {blob_name: {_eq: $blobName}, transaction_hash: {_eq: $txHash}}, limit: 1) {
            transaction_hash
            event_type
          }
        }
        """

        variables = {"blobName": full_blob_name, "txHash": aptos_tx_hash}
        payload = None
        blobs = []
        activities = []
        for attempt in range(5):
            try:
                async with httpx.AsyncClient(timeout=30.0) as client:
                    response = await client.post(
                        settings.SHELBY_INDEXER_URL,
                        headers=headers,
                        json={"query": query, "variables": variables},
                    )
                    response.raise_for_status()
            except httpx.HTTPStatusError as exc:
                raise ValueError(_http_error_message("Shelby indexer", exc)) from exc
            except httpx.RequestError as exc:
                raise ValueError(f"Could not reach Shelby indexer: {exc}") from exc

            payload = response.json()
            if payload.get("errors"):
                raise ValueError(f"Shelby indexer rejected verification query: {payload['errors'][0].get('message')}")

            blobs = payload.get("data", {}).get("blobs") or []
            activities = payload.get("data", {}).get("blob_activities") or []
            blob_is_written = bool(blobs) and _is_truthy_flag(blobs[0].get("is_written"))
            if blobs and blob_is_written and (not aptos_tx_hash or activities):
                break
            if attempt < 4:
                await asyncio.sleep(2)

        if not blobs:
            raise ValueError("Shelby blob was not found for this wallet.")

        blob = blobs[0]
        if blob.get("owner") and _normalize_address(blob["owner"]) != _normalize_address(owner_address):
            raise ValueError("Shelby blob owner does not match the connected wallet.")

        if _is_deleted_flag(blob.get("is_deleted")):
            raise ValueError("Shelby blob is marked as deleted.")

        if not _is_truthy_flag(blob.get("is_written")):
            raise ValueError("Shelby blob exists but is not marked as written yet.")

        blob_size = int(blob.get("size") or 0)
        if blob_size != file_size:
            raise ValueError("Shelby blob size does not match the submitted file size.")

        if aptos_tx_hash:
            normalized_hash = _normalize_tx_hash(aptos_tx_hash)
            if not any(
                activity.get("transaction_hash") and _normalize_tx_hash(activity["transaction_hash"]) == normalized_hash
                for activity in activities
            ):
                raise ValueError("Aptos transaction is not linked to this Shelby blob.")

        return {
            "blob_name": blob.get("blob_name"),
            "owner": blob.get("owner"),
            "size": blob_size,
            "is_written": blob.get("is_written"),
        }


proof_verifier = ProofVerifier()
