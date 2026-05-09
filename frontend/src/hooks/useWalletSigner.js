import { AccountAddress, Ed25519PublicKey } from "@aptos-labs/ts-sdk";
import { useMemo } from "react";
import { useAptosWallet } from "./useAptosWallet";

/**
 * Creates a Shelby-compatible signer from the connected Petra wallet.
 * Uses window.aptos directly — no wallet adapter package needed.
 */
export function useWalletSigner() {
  const { account, connected, signTransaction, connect, disconnect, isInstalled, loading } =
    useAptosWallet();

  const signer = useMemo(() => {
    if (!connected || !account) return null;

    return {
      accountAddress: AccountAddress.fromString(account.address),
      publicKey: account.publicKey
        ? new Ed25519PublicKey(
            typeof account.publicKey === "string"
              ? account.publicKey
              : account.publicKey.toString()
          )
        : null,

      // Petra signs the Shelby storage transaction
      signTransaction: async (transaction) => {
        try {
          return await signTransaction(transaction);
        } catch (err) {
          if (err?.code === 4001 || err?.message?.includes("rejected")) {
            throw new Error("USER_REJECTED");
          }
          throw err;
        }
      },
    };
  }, [account, connected, signTransaction]);

  return { signer, connected, account, connect, disconnect, isInstalled, loading };
}
