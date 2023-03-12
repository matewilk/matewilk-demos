import { Dispatch, SetStateAction } from "react";
import { multiplyFloats, truncateEthAddress } from "@/utils/ethereum";
import { useWallet } from "@/hooks/useWallet";
import { SendTransactionForm } from "./SendTransactionForm";
import { useCoinGecko } from "@/hooks/useCoinGecko";

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
        <div className="text-sm font-thin text-red-400">
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

  const eth = useCoinGecko(data?.value);

  const balanceFiat = multiplyFloats(
    [data?.formatted as string],
    eth?.ethereum?.gbp || 0
  );

  const animateText = (size = "md") =>
    `${
      showSendForm ? "text-sm" : `text-${size}`
    } transition-all duration-300 ease-in-out`;

  return (
    <div className={`flex flex-col gap-5 ${animateText()} text-slate-200`}>
      <div className="flex-col text-center">
        <span>Your Address</span>
        <h3 className={animateText("lg")}>{truncateEthAddress(address)}</h3>
      </div>
      <div className="flex-col text-center">
        <span>Your Balance</span>
        <div className="flex items-center justify-center">
          <h3
            className={animateText("lg")}
          >{`${data?.formatted} ${data?.symbol}`}</h3>
        </div>
        <div className="flex items-center justify-center">
          <h3 className="text-lg font-normal text-white">{`£ ${balanceFiat}`}</h3>
        </div>
      </div>
    </div>
  );
};

const WalletBalance = ({
  showSendForm,
  setShowSendForm,
}: {
  showSendForm: boolean;
  setShowSendForm: Dispatch<SetStateAction<boolean>>;
}) => {
  const { connect, account } = useWallet();
  const { isLoading } = connect;
  const { isConnected } = account;

  const animateHeight = `${
    // provide max-h-[val] arbitary maximum value
    // for the component to animate to its content height
    showSendForm ? "max-h-[60rem] py-5" : "max-h-52 py-8"
  } transition-all duration-700 ease-in-out`;

  return (
    <div
      className={`${animateHeight} frosted w-full max-w-3xl overflow-hidden rounded-xl px-10`}
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
