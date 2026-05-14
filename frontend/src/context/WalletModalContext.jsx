import { createContext, useContext, useState } from "react";

const WalletModalContext = createContext();

export function WalletModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <WalletModalContext.Provider value={{
      isOpen,
      openModal: () => setIsOpen(true),
      closeModal: () => setIsOpen(false),
    }}>
      {children}
    </WalletModalContext.Provider>
  );
}

export function useWalletModal() {
  return useContext(WalletModalContext);
}
