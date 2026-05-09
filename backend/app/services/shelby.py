import httpx
from ..config import settings

class ShelbyService:
    def __init__(self):
        self.base_url = settings.SHELBY_API_URL.rstrip("/")
        self.headers = {"Authorization": f"Bearer {settings.SHELBY_API_KEY}"}

    async def upload_blob(self, file_bytes: bytes, file_name: str, content_type: str) -> dict:
        async with httpx.AsyncClient(timeout=120.0) as client:
            response = await client.post(
                f"{self.base_url}/blobs",
                headers=self.headers,
                files={"file": (file_name, file_bytes, content_type)},
            )
            response.raise_for_status()
            data = response.json()
            blob_id = data.get("blob_id") or data.get("id")
            blob_url = data.get("url") or f"{self.base_url}/blobs/{blob_id}"
            return {"blob_id": blob_id, "blob_url": blob_url}

shelby_service = ShelbyService()
