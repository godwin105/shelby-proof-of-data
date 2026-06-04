import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { Network } from "@aptos-labs/ts-sdk";

import Navbar from "./components/Navbar";
import WalletModal from "./components/WalletModal";
import { WalletModalProvider } from "./context/WalletModalContext";

import HomePage from "./pages/HomePage";
import ProvePage from "./pages/ProvePage";
import VerifyPage from "./pages/VerifyPage";
import AboutPage from "./pages/AboutPage";

const queryClient = new QueryClient();
const APTOS_API_KEY = import.meta.env.VITE_SHELBY_API_KEY || import.meta.env.VITE_APTOS_API_KEY;

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AptosWalletAdapterProvider
        autoConnect={true}
        dappConfig={{
          network: Network.TESTNET,
          aptosApiKeys: { testnet: APTOS_API_KEY },
        }}
      >
        <WalletModalProvider>
          <BrowserRouter>
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: "rgb(var(--surface))",
                  color: "rgb(var(--text))",
                  border: "1px solid rgb(var(--border))",
                  borderRadius: "14px",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "14px",
                  maxWidth: "90vw",
                },
                success: { iconTheme: { primary: "#FF7AD9", secondary: "#0B0B0E" } },
                error: { iconTheme: { primary: "#FF5F7D", secondary: "#0B0B0E" } },
              }}
            />

            <WalletModal />

            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1 w-full">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/prove" element={<ProvePage />} />
                  <Route path="/verify" element={<VerifyPage />} />
                  <Route path="/about" element={<AboutPage />} />
                </Routes>
              </main>
              <footer className="border-t border-shelby-border py-6">
                <div className="page-shell flex flex-col sm:flex-row items-center justify-between gap-3">
                  <p className="text-xs font-mono text-shelby-muted">
                    Copyright 2025 Shelby Proof-of-Data
                  </p>
                  <p className="text-xs font-mono text-shelby-muted">
                    Built on <span className="text-shelby-accent">Aptos</span> /{" "}
                    <span className="text-shelby-accent">Shelby Network</span>
                  </p>
                </div>
              </footer>
            </div>
          </BrowserRouter>
        </WalletModalProvider>
      </AptosWalletAdapterProvider>
    </QueryClientProvider>
  );
}
