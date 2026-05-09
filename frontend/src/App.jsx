import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ShelbyClientProvider } from "@shelby-protocol/react";
import { ShelbyClient } from "@shelby-protocol/sdk/browser";
import { AptosConfig, Network } from "@aptos-labs/ts-sdk";
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";

import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import VerifyPage from "./pages/VerifyPage";
import AboutPage from "./pages/AboutPage";

const queryClient = new QueryClient();

const aptosConfig = new AptosConfig({
  network: Network.TESTNET,
  ...(import.meta.env.VITE_APTOS_API_KEY && {
    clientConfig: {
      HEADERS: {
        "x-api-key": import.meta.env.VITE_APTOS_API_KEY,
      },
    },
  }),
});

const shelbyClient = new ShelbyClient({ network: Network.TESTNET, aptosConfig });

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Wallet adapter v4 uses Aptos Wallet Standard — Petra auto-detected, no plugins needed */}
      <AptosWalletAdapterProvider autoConnect={true}>
        <ShelbyClientProvider client={shelbyClient}>
          <BrowserRouter>
            <Toaster
              position="top-center"
              toastOptions={{
                style: {
                  background: "#111518",
                  color: "#E8EDF2",
                  border: "1px solid #1E2428",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "14px",
                  maxWidth: "90vw",
                },
                success: { iconTheme: { primary: "#00C896", secondary: "#111518" } },
                error:   { iconTheme: { primary: "#FF4D6A", secondary: "#111518" } },
              }}
            />
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1 w-full">
                <Routes>
                  <Route path="/"       element={<HomePage />} />
                  <Route path="/verify" element={<VerifyPage />} />
                  <Route path="/about"  element={<AboutPage />} />
                </Routes>
              </main>
              <footer className="border-t border-shelby-border py-5 text-center px-4">
                <p className="text-xs font-mono text-shelby-muted">
                  Shelby Proof-of-Data · Built on{" "}
                  <span className="text-shelby-accent">Aptos</span> ·{" "}
                  <span className="text-shelby-accent">Shelby Network</span>
                </p>
              </footer>
            </div>
          </BrowserRouter>
        </ShelbyClientProvider>
      </AptosWalletAdapterProvider>
    </QueryClientProvider>
  );
}
