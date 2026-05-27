import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api/v1";

const api = axios.create({ baseURL: API_BASE_URL, timeout: 120_000 });

/**
 * Compute SHA-256 hash of a file using the browser Web Crypto API.
 * The file never leaves the browser; it is hashed locally.
 */
export async function computeSHA256(file) {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Submit proof metadata to backend after Shelby upload completes.
 * Sends the real Shelby blob ID, blob URL and Aptos tx hash.
 */
export async function submitProof({
  fileHash,
  fileName,
  fileSize,
  fileType,
  shelbyBlobId,
  shelbyBlobUrl,
  aptosTxHash,
}) {
  const { data } = await api.post("/proof", {
    file_hash: fileHash,
    file_name: fileName,
    file_size: fileSize,
    file_type: fileType,
    shelby_blob_id: shelbyBlobId,
    shelby_blob_url: shelbyBlobUrl ?? null,
    aptos_tx_hash: aptosTxHash ?? null,
  });
  return data;
}

/**
 * Verify a proof by its SHA-256 hash string.
 */
export async function verifyByHash(hash) {
  const { data } = await api.get(`/verify/${hash}`);
  return data;
}

/**
 * Verify a proof by uploading the original file.
 * The file is hashed in-browser and never sent to the server.
 */
export async function verifyByFile(file) {
  const fileHash = await computeSHA256(file);
  const { data } = await api.get(`/verify/${fileHash}`);
  return data;
}
