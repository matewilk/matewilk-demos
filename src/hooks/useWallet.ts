import { useContext } from "react";
import { WalletContext } from "@/providers/WalletContextProvider";

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used with a WalletProvider");
  }

  return context;
};
