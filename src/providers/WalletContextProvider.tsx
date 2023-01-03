import { createContext, useState } from "react";
import {
  FetchBalanceResult,
  GetAccountResult,
  FetchFeeDataResult,
} from "@wagmi/core";
import {
  useAccount,
  useDisconnect,
  useConnect,
  useBalance,
  useFeeData,
  useWaitForTransaction,
} from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";

// since wagmi does not export proper Connector type
export type ConnectorType = {
  isLoading: boolean;
  error: Error;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
};

export type FetchFeeDataResultType = {
  isFetching: boolean;
  data: FetchFeeDataResult;
};

export type WalletContextType = {
  account: GetAccountResult;
  balance: { data: FetchBalanceResult | undefined };
  connect: ConnectorType;
  disconnect: ConnectorType;
  gas: FetchFeeDataResultType;
  transaction: {
    setTxHash: (hash: `0x${string}` | undefined) => void;
    isLoading: boolean;
    isSuccess: boolean;
    isError: boolean;
  };
};

export const WalletContext = createContext<WalletContextType | null>(null);

export const WalletProvider = (props: any) => {
  const [hash, setTxHash] = useState<`0x${string}` | undefined>(undefined);
  const { isLoading, isSuccess, isError } = useWaitForTransaction({
    hash,
  });

  const connect = useConnect({
    connector: new InjectedConnector(),
  });
  const disconnect = useDisconnect();
  const account = useAccount();
  const balance = useBalance({
    address: account.address,
    watch: true,
  });
  const gas = useFeeData({
    formatUnits: "ether",
    watch: true,
  });

  const value = {
    connect,
    disconnect,
    account,
    balance,
    gas,
    transaction: {
      setTxHash,
      isLoading,
      isSuccess,
      isError,
    },
  };

  return <WalletContext.Provider value={value} {...props} />;
};
