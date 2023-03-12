import { Dispatch, SetStateAction } from "react";
import {
  ChevronDoubleUpIcon,
  ChevronDoubleDownIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { GetAccountResult } from "@wagmi/core";
import { useWallet } from "@/hooks/useWallet";

const SendButton = ({
  setShowSendForm,
  showSendForm,
}: {
  setShowSendForm: Dispatch<SetStateAction<boolean>>;
  showSendForm: boolean;
}) => {
  const { account } = useWallet();
  const { isConnected } = account;

  return (
    <div
      className={`flex flex-col items-center gap-1 p-3 ${
        !isConnected && "text-slate-400"
      }`}
    >
      <button
        className="flex flex-col items-center"
        onClick={() => setShowSendForm(true)}
      >
        <ChevronDoubleUpIcon
          className={`h-14 w-14 rounded-md ${
            isConnected && !showSendForm ? "btn-blue" : "border-2 bg-white/10"
          } p-3`}
        />
        Send
      </button>
    </div>
  );
};

const ConnectButton = () => {
  const { connect, account, disconnect } = useWallet();
  const { isConnected } = account;

  const handler = isConnected ? disconnect.disconnect : connect.connect;

  return (
    <div className="flex flex-col items-center gap-1 p-3">
      <button className="flex flex-col items-center" onClick={() => handler()}>
        <PlusIcon
          className={`h-14 w-14 rounded-md ${
            isConnected ? "btn-white" : "btn-blue"
          }  p-3`}
        />
        {isConnected ? "Disconnect Wallet" : "Connect Wallet"}
      </button>
    </div>
  );
};

const ReceiveButton = () => {
  const { account } = useWallet();
  const { isConnected }: GetAccountResult = account;

  return (
    <div
      className={`flex flex-col items-center gap-1 p-3 ${
        isConnected ? "text-slate-400" : "text-slate-400"
      }`}
    >
      <ChevronDoubleDownIcon
        className={`h-14 w-14 rounded-md ${
          isConnected
            ? "border-2 border-slate-400"
            : "border-2 border-slate-400"
        } p-3`}
      />
      Request
    </div>
  );
};

const WalletActions = ({
  setShowSendForm,
  showSendForm,
}: {
  setShowSendForm: Dispatch<SetStateAction<boolean>>;
  showSendForm: boolean;
}) => {
  return (
    <div className="frosted flex w-full max-w-3xl flex-row items-center justify-around rounded-xl pt-2">
      <SendButton
        setShowSendForm={setShowSendForm}
        showSendForm={showSendForm}
      />
      <ConnectButton />
      <ReceiveButton />
    </div>
  );
};

export default WalletActions;
