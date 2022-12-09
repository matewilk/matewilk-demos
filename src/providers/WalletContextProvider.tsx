import { createContext } from "react";
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
} from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";

// since wagmi does not export proper Connector type
export type ConnectorType = {
  isLoading: boolean;
  error: Error;
  connect: Function;
  disconnect: Function;
};

export type FetchFeeDataResultType = {
  isFetching: boolean;
  data: FetchFeeDataResult;
};

export type WalletContextType = {
  account: GetAccountResult;
  balance: { data: FetchBalanceResult };
  connect: ConnectorType;
  disconnect: ConnectorType;
  gas: FetchFeeDataResultType;
};

export const WalletContext = createContext<WalletContextType | null>(null);

export const WalletProvider = (props: any) => {
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

  const value = { connect, disconnect, account, balance, gas };

  return <WalletContext.Provider value={value} {...props} />;
};
