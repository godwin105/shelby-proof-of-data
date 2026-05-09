import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { AccountAddress, Ed25519PublicKey } from "@aptos-labs/ts-sdk";
import { useMemo } from "react";

/**
 * Creates an Account-compatible signer from the connected Petra wallet.
 * This wraps the wallet adapter's signTransaction so users sign with
 * their OWN wallet — no private key ever stored in the project.
 *
 * Compatible with @shelby-protocol/react useUploadBlobs signer interface.
 */
export function useWalletSigner() {
  const { account, connected, signTransaction } = useWallet();

  const signer = useMemo(() => {
    if (!connected || !account) return null;

    return {
      // Aptos SDK Account interface
      accountAddress: AccountAddress.fromString(account.address),

      publicKey: account.publicKey
        ? new Ed25519PublicKey(
            typeof account.publicKey === "string"
              ? account.publicKey
              : account.publicKey.toString()
          )
        : null,

      // Called by Shelby SDK to sign each storage transaction
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

  return { signer, connected, account };
}
