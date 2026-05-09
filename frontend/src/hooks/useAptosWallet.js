import { useState, useEffect, useCallback } from "react";

/**
 * Direct Petra wallet integration using window.aptos (injected by Petra extension).
 * No wallet adapter packages needed — zero dependency conflicts.
 * Also compatible with Martian wallet which uses the same window.aptos API.
 */
export function useAptosWallet() {
  const [account, setAccount] = useState(null);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if Petra is installed
  const petra = typeof window !== "undefined" ? window.aptos : null;
  const isInstalled = Boolean(petra);

  // Auto-connect if already approved
  useEffect(() => {
    if (!petra) { setLoading(false); return; }
    petra.isConnected()
      .then((isConn) => {
        if (isConn) {
          return petra.account().then((acc) => {
            setAccount(acc);
            setConnected(true);
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const connect = useCallback(async () => {
    if (!petra) {
      window.open("https://petra.app", "_blank");
      return;
    }
    try {
      const acc = await petra.connect();
      setAccount(acc);
      setConnected(true);
    } catch (err) {
      if (err?.code !== 4001) console.error("Wallet connect error:", err);
    }
  }, [petra]);

  const disconnect = useCallback(async () => {
    if (!petra) return;
    try {
      await petra.disconnect();
    } catch {}
    setAccount(null);
    setConnected(false);
  }, [petra]);

  const signTransaction = useCallback(async (transaction) => {
    if (!petra) throw new Error("Wallet not connected");
    return await petra.signTransaction(transaction);
  }, [petra]);

  return { account, connected, loading, isInstalled, connect, disconnect, signTransaction };
}
