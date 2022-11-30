import { truncateEthAddress } from "@/utils/ethereum";
import { useWallet } from "@/hooks/useWallet";
import { SendTransactionForm } from "./SendTransactionForm";

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

const Balance = () => {
  const { account, balance } = useWallet();
  const { address } = account;
  const { data } = balance;

  const shortBalance = parseFloat(data?.formatted).toFixed(8);

  return (
    <div className="flex flex-row justify-around">
      <div>
        <div>
          <span>Total Balance</span>
          <h3 className="text-2xl">{`${shortBalance} ${data?.symbol}`}</h3>
          <span className="text-slate-500">{`${data?.formatted} ${data?.symbol}`}</span>
        </div>
      </div>
      <div className="flex flex-col">
        <span>Address</span>
        <h3 className="text-2xl">{truncateEthAddress(address)}</h3>
      </div>
    </div>
  );
};

const WalletBalance = ({
  showSendForm,
  setShowSendForm,
}: {
  showSendForm: boolean;
  setShowSendForm: Function;
}) => {
  const { connect, account } = useWallet();
  const { isLoading } = connect;
  const { isConnected } = account;

  return (
    <div className="w-full max-w-2xl rounded-xl bg-white p-10 sm:w-3/4 lg:w-1/2">
      {isLoading || !isConnected ? (
        <WalletPlaceholder />
      ) : (
        <>
          {showSendForm ? (
            <SendTransactionForm setShowSendForm={setShowSendForm} />
          ) : (
            <Balance />
          )}
        </>
      )}
    </div>
  );
};

export default WalletBalance;
