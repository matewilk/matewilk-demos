import { WalletState } from "./WalletContext";

// actions
export const CONNECT = "CONNECT";
export const SEND_TRANSACTION = "SEND_TRANSACTION";
export const CHAIN_CHANGE = "CHAIN_CHANGE";
export const FETCH_HISTORY = "FETCH_HISTORY";

// action creators
export const connect = (data: Partial<WalletState>) => ({
  type: CONNECT,
  ...data,
});

export const send = (data: Partial<WalletState>) => ({
  type: SEND_TRANSACTION,
  ...data,
});

export const chainChange = (chain: number) => ({
  type: CHAIN_CHANGE,
  chain,
});

export const fetchHistory = (data: any) => ({
  type: FETCH_HISTORY,
});

export const walletReducer = (wallet: WalletState, action: any) => {
  switch (action.type) {
    case CONNECT: {
      return {
        ...wallet,
        connected: action.connected,
        balance: action.balance,
        address: action.address,
        error: action.error,
      };
    }
    case SEND_TRANSACTION: {
      return {
        ...wallet,
        transaction: action.transaction,
        error: action.error,
      };
    }
    case CHAIN_CHANGE: {
      return {
        ...wallet,
        chain: action.chain,
      };
    }
    case FETCH_HISTORY: {
    }
    default: {
      throw Error("Unknown action: " + action.type);
    }
  }
};
