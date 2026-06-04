import { ShelbyClient } from "@shelby-protocol/sdk/browser";
import { Network } from "@aptos-labs/ts-sdk";

const API_KEY = import.meta.env.VITE_SHELBY_API_KEY || import.meta.env.VITE_APTOS_API_KEY;

export const shelbyClient = new ShelbyClient({
  network: Network.TESTNET,
  apiKey: API_KEY,
  indexer: { apiKey: API_KEY },
  rpc: { apiKey: API_KEY },
});
