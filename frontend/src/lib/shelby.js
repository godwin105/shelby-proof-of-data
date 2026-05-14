import { ShelbyClient } from "@shelby-protocol/sdk/browser";
import { Network } from "@aptos-labs/ts-sdk";

// Shared Shelby client instance — used across the app
// No aptosConfig needed — authentication handled by wallet adapter
export const shelbyClient = new ShelbyClient({
  network: Network.TESTNET,
});
