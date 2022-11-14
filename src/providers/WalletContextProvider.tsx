import { createContext } from "react";
import { useAccount, useDisconnect, useConnect, useBalance } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";

export const WalletContext = createContext(null);

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

  const value = { connect, disconnect, account, balance };

  return <WalletContext.Provider value={value} {...props} />;
};
