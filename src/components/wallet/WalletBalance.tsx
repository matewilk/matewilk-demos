import { useAccount, useBalance, useConnect } from "wagmi";
import truncateEthAddress from "../../utils/truncate-eth-address";

import { useWallet } from "@/hooks/useWallet";

const WalletPlaceholder = () => {
  const { connect, account } = useWallet();
  const { isLoading, error } = connect;
  const { isConnecting, isReconnecting } = account;

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <h1 className="">
        {isLoading || isConnecting || isReconnecting
          ? "Connecting..."
          : "Connect Wallet"}
      </h1>
      {error && (
        <div className="text-sm font-bold text-red-400">
          <div>{error.message}</div>
        </div>
      )}
    </div>
  );
};

const WalletBalance = () => {
  const { connect, account, balance } = useWallet();
  const { isLoading } = connect;
  const { address, isConnected } = account;
  const { data } = balance;

  return (
    <div className="h-64 w-full max-w-2xl rounded-xl bg-white p-10 sm:w-3/4 lg:w-1/2">
      {isLoading || !isConnected ? (
        <WalletPlaceholder />
      ) : (
        <>
          <div className="flex flex-row justify-around">
            <div>
              <div>
                <span>Total Balance</span>
                <h3 className="py-5 text-2xl">{`${data?.formatted} ${data?.symbol}`}</h3>
              </div>
              <div className="mt-6">
                <span>Monthly change</span>
                <div>
                  <h3 className="py-1 text-xl">$ 1,264.05</h3>
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <span>Address</span>
              <span className="text-md py-7">
                {truncateEthAddress(address)}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default WalletBalance;
