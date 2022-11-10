import React, {
  type Dispatch,
  createContext,
  useContext,
  useReducer,
} from "react";
import { walletReducer } from "./walletReducer";

type WalletData = {
  connected: boolean;
  chain: number;
  balance: string;
  address: string;
  transaction: unknown;
  history: [];
};

export type Wallet = {
  data: WalletData;
  isLoading: boolean;
  error?: string;
};

const initialState: Wallet = {
  data: {
    connected: false,
    chain: 1,
    balance: "",
    address: "",
    transaction: {},
    history: [],
  },
  isLoading: false,
  error: "",
};

const WalletContext = createContext(
  {} as { wallet: Wallet; dispatch: Dispatch<any> }
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
