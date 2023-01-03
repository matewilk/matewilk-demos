import type { NextPage } from "next";
import { WagmiConfig } from "wagmi";

import { useIsMounted } from "@/hooks/useIsMounted";
import Header from "@/components/layout/Header";
import Wallet from "@/components/wallet/Wallet";
import TransactionHistory from "@/components/wallet/TransactionHistory";
import { client } from "@/components/wallet/wagmi.config";
import { WalletProvider } from "@/providers/WalletContextProvider";

const Dashboard: NextPage = () => {
  const isMounted = useIsMounted();

  return (
    <WagmiConfig client={client}>
      <WalletProvider>
        {isMounted ? (
          // layout class to flex-grow containers in tx history component
          <div className="flex min-h-screen flex-col">
            <Header />
            <Wallet />
            <TransactionHistory />
          </div>
        ) : null}
      </WalletProvider>
    </WagmiConfig>
  );
};

export default Dashboard;
