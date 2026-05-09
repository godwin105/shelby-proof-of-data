import axios from "axios";

const api = axios.create({ baseURL: "/api/v1", timeout: 120_000 });

/**
 * Compute SHA-256 hash of a file using the browser Web Crypto API.
 */
export async function computeSHA256(file) {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Submit proof metadata to backend after Shelby upload is complete.
 * Backend records the hash on Aptos and saves to MySQL.
 */
export async function submitProof({ fileHash, fileName, fileSize, fileType, shelbyBlobId, shelbyBlobUrl }) {
  const { data } = await api.post("/proof", {
    file_hash: fileHash,
    file_name: fileName,
    file_size: fileSize,
    file_type: fileType,
    shelby_blob_id: shelbyBlobId,
    shelby_blob_url: shelbyBlobUrl ?? null,
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
 * Verify a proof by hashing the original file in-browser.
 */
export async function verifyByFile(file) {
  const fileHash = await computeSHA256(file);
  const { data } = await api.get(`/verify/${fileHash}`);
  return data;
}
