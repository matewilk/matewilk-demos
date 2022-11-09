import React, {
  type Dispatch,
  createContext,
  useContext,
  useReducer,
} from "react";
import { walletReducer } from "./walletReducer";

export type WalletState = {
  connected: boolean;
  chain: string;
  balance: string;
  address: string;
  error: string;
  transaction: unknown;
  history: [];
};

const initialState: WalletState = {
  connected: false,
  chain: "",
  balance: "",
  address: "",
  error: "",
  transaction: {},
  history: [],
};

const WalletContext = createContext(
  {} as { wallet: WalletState; dispatch: Dispatch<any> }
);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [wallet, dispatch] = useReducer(walletReducer, initialState);

  return (
    <WalletContext.Provider value={{ wallet, dispatch }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used with a WalletProvider");
  }

  return context;
}
