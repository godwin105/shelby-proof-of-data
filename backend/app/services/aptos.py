from aptos_sdk.account import Account
from aptos_sdk.async_client import RestClient
from aptos_sdk.transactions import EntryFunction, TransactionArgument, TransactionPayload
from aptos_sdk.bcs import Serializer
from ..config import settings


class AptosService:
    """
    Lazy-initialized Aptos service.
    The account and client are only created when first used,
    so missing credentials won't crash the server on startup.
    """

    def __init__(self):
        self._client = None
        self._account = None

    def _get_client(self):
        if self._client is None:
            self._client = RestClient(settings.APTOS_NODE_URL)
        return self._client

    def _get_account(self):
        if self._account is None:
            if not settings.APTOS_PRIVATE_KEY:
                raise ValueError("APTOS_PRIVATE_KEY is not set in .env")
            self._account = Account.load_key(settings.APTOS_PRIVATE_KEY)
        return self._account

    async def record_proof(self, file_hash: str) -> str:
        """Record a file hash on-chain. Returns the transaction hash."""
        if not settings.APTOS_MODULE_ADDRESS:
            raise ValueError("APTOS_MODULE_ADDRESS is not set in .env")
        client = self._get_client()
        account = self._get_account()
        payload = EntryFunction.natural(
            f"{settings.APTOS_MODULE_ADDRESS}::proof_of_data",
            "record_proof",
            [],
            [TransactionArgument(file_hash, Serializer.str)],
        )
        signed_tx = await client.create_bcs_signed_transaction(
            account, TransactionPayload(payload)
        )
        tx_hash = await client.submit_bcs_transaction(signed_tx)
        await client.wait_for_transaction(tx_hash)
        return tx_hash

    async def verify_on_chain(self, file_hash: str) -> dict:
        """Check if a proof exists on-chain."""
        if not settings.APTOS_MODULE_ADDRESS:
            return {"exists": False, "chain_timestamp": None}
        try:
            client = self._get_client()
            result = await client.view_bcs_payload(
                f"{settings.APTOS_MODULE_ADDRESS}::proof_of_data::get_proof",
                [],
                [settings.APTOS_MODULE_ADDRESS, file_hash],
            )
            return {"exists": bool(result[0]), "chain_timestamp": result[1]}
        except Exception:
            return {"exists": False, "chain_timestamp": None}


aptos_service = AptosService()
