import { Wallet } from "./WalletContext";

type Subset<K> = {
  [attr in keyof K]?: K[attr] extends object
    ? Subset<K[attr]>
    : K[attr] extends object | null
    ? Subset<K[attr]> | null
    : K[attr] extends object | null | undefined
    ? Subset<K[attr]> | null | undefined
    : K[attr];
};

// actions
export const CONNECT = "CONNECT";
export const SEND_TRANSACTION = "SEND_TRANSACTION";
export const CHAIN_CHANGE = "CHAIN_CHANGE";
export const FETCH_HISTORY = "FETCH_HISTORY";

export enum WalletActions {
  CONNECT = "CONNECT",
  SEND_TRANSACTION = "SEND_TRANSACTION",
  CHAIN_CHANGE = "CHAIN_CHANGE",
  FETCH_HISTORY = "FETCH_HISTORY",
}

interface WalletAction {
  type: WalletActions;
  [key: string]: any;
}

// action creators
export const connect = (data: Subset<Wallet>) => ({
  type: CONNECT,
  data,
});

export const send = (data: Subset<Wallet>) => ({
  type: SEND_TRANSACTION,
  data,
});

export const chainChange = (data: Subset<Wallet>) => ({
  type: CHAIN_CHANGE,
  data,
});

export const fetchHistory = (data: any) => ({
  type: FETCH_HISTORY,
});

export const walletReducer = (wallet: Wallet, action: WalletAction) => {
  const { type, data } = action;
  switch (type) {
    case CONNECT: {
      return {
        ...wallet,
        ...data,
      };
    }
    case SEND_TRANSACTION: {
      return {
        ...wallet,
        ...data,
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
