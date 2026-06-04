CREATE DATABASE IF NOT EXISTS shelby_pod
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE shelby_pod;

CREATE TABLE IF NOT EXISTS proofs (
  id BIGINT NOT NULL AUTO_INCREMENT,
  file_hash VARCHAR(64) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_size BIGINT NOT NULL,
  file_type VARCHAR(100) NULL,
  owner_address VARCHAR(66) NULL,
  shelby_blob_id VARCHAR(255) NOT NULL,
  shelby_blob_url VARCHAR(512) NULL,
  aptos_tx_hash VARCHAR(100) NULL,
  `timestamp` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_proofs_file_hash (file_hash),
  KEY ix_proofs_file_hash (file_hash)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Run this only if you already had a proofs table before owner_address was added:
-- ALTER TABLE proofs ADD COLUMN owner_address VARCHAR(66) NULL AFTER file_type;
