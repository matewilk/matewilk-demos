import truncateEthAddress from "../../../utils/truncate-eth-address";
import { useWallet } from "./WalletContext";

const WalletBalance = () => {
  const {
    wallet: { connected, balance, address, error },
  } = useWallet();
  return (
    <div className="h-64 w-full max-w-2xl rounded-xl bg-white p-10 sm:w-3/4 lg:w-1/2">
      {connected ? (
        <>
          <div className="flex flex-row justify-around">
            <div>
              <div>
                <span>Total Balance</span>
                <h3 className="py-5 text-3xl">{balance}</h3>
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
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center">
          <div className="">Connect Wallet</div>
          {error && (
            <div className="text-sm font-bold text-red-400">
              <div>{error}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WalletBalance;
