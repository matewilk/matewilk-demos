import { Dispatch, SetStateAction } from "react";
import {
  ChevronDoubleUpIcon,
  ChevronDoubleDownIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { GetAccountResult } from "@wagmi/core";
import { useWallet } from "@/hooks/useWallet";
import { ReducerStateWithoutAction } from "react";

const SendButton = ({
  setShowSendForm,
}: {
  setShowSendForm: Dispatch<SetStateAction<boolean>>;
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
            isConnected
              ? "bg-blue-300 hover:bg-blue-400 active:bg-blue-500"
              : "bg-slate-200"
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
            isConnected ? "bg-slate-200" : "bg-blue-300"
          }  p-3 hover:bg-blue-400 active:bg-blue-500`}
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
        !isConnected && "text-slate-400"
      }`}
    >
      <ChevronDoubleDownIcon
        className={`h-14 w-14 rounded-md ${
          isConnected
            ? "bg-blue-300 hover:bg-blue-400 active:bg-blue-500"
            : "bg-slate-200"
        } p-3`}
      />
      Request
    </div>
  );
};

const WalletActions = ({
  setShowSendForm,
}: {
  setShowSendForm: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <div className="flex w-full max-w-3xl flex-row items-center justify-around rounded-xl bg-white pt-2">
      <SendButton setShowSendForm={setShowSendForm} />
      <ConnectButton />
      <ReceiveButton />
    </div>
  );
};

export default WalletActions;
