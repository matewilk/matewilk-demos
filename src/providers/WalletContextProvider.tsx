import { createContext } from "react";
import { FetchBalanceResult, GetAccountResult } from "@wagmi/core";
import { useAccount, useDisconnect, useConnect, useBalance } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";

// since wagmi does not export proper Connector type
export type ConnectorType = {
  isLoading: boolean;
  error: Error;
  connect: Function;
  disconnect: Function;
};

export type WalletContextType = {
  account: GetAccountResult;
  balance: { data: FetchBalanceResult };
  connect: ConnectorType;
  disconnect: ConnectorType;
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
    watch: false,
  });

  const value = { connect, disconnect, account, balance };

  return <WalletContext.Provider value={value} {...props} />;
};
