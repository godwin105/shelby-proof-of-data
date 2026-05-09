import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { AccountAddress, Ed25519PublicKey } from "@aptos-labs/ts-sdk";
import { useMemo } from "react";

export function useWalletSigner() {
  const { account, connected, signTransaction, connect, disconnect, wallets } = useWallet();

  const signer = useMemo(() => {
    if (!connected || !account) return null;

    // Safely convert address to string regardless of type
    const addressStr = typeof account.address === "string"
      ? account.address
      : account.address?.toString() ?? "";

    // Safely convert publicKey to string
    const pubKeyStr = account.publicKey
      ? (typeof account.publicKey === "string"
          ? account.publicKey
          : account.publicKey?.toString() ?? "")
      : null;

    return {
      accountAddress: AccountAddress.fromString(addressStr),
      publicKey: pubKeyStr ? new Ed25519PublicKey(pubKeyStr) : null,
      signTransaction: async (transaction) => {
        try {
          return await signTransaction(transaction);
        } catch (err) {
          if (err?.message?.includes("rejected") || err?.code === 4001) {
            throw new Error("USER_REJECTED");
          }
          throw err;
        }
      },
    };
  }, [account, connected, signTransaction]);

  return {
    signer,
    connected,
    account,
    connect,
    disconnect,
    wallets,
  };
}