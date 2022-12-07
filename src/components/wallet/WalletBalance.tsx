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

const Balance = ({ showSendForm }: { showSendForm: boolean }) => {
  const { account, balance } = useWallet();
  const { address } = account;
  const { data } = balance;

  const animateText = `${
    showSendForm ? "text-sm" : "text-md"
  } transition-all duration-300 ease-in-out`;

  return (
    <div className={`flex flex-row gap-5 ${animateText}`}>
      <div className="flex-1">
        <div>
          <span>{`Your Balance (${data?.symbol})`}</span>
          <h3 className="">{`${data?.formatted}`}</h3>
        </div>
      </div>
      <div className="flex-1 flex-col">
        <span>Your Address</span>
        <h3 className="">{truncateEthAddress(address)}</h3>
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

  const animateHeight = `${
    // provide max-h-[val] arbitary maximum value
    // for the component to animate to its content height
    showSendForm ? "max-h-[60rem] py-5" : "max-h-32 py-10"
  } transition-all duration-700 ease-in-out`;

  return (
    <div
      className={`${animateHeight} w-full max-w-3xl overflow-hidden rounded-xl bg-white px-10`}
    >
      {isLoading || !isConnected ? (
        <WalletPlaceholder />
      ) : (
        <>
          <Balance showSendForm={showSendForm} />
          <SendTransactionForm
            setShowSendForm={setShowSendForm}
            showSendForm={showSendForm}
          />
        </>
      )}
    </div>
  );
};

export default WalletBalance;
