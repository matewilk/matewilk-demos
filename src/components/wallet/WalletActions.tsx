import {
  ChevronDoubleUpIcon,
  ChevronDoubleDownIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

const SendButton = ({
  connected,
  sendTransaction,
}: {
  connected: boolean;
  sendTransaction: Function;
}) => {
  return (
    <div
      className={`flex flex-col items-center gap-1 p-3 ${
        !connected && "text-slate-400"
      }`}
    >
      <button
        className="flex flex-col items-center"
        onClick={() => {
          sendTransaction();
        }}
      >
        <ChevronDoubleUpIcon
          className={`h-14 w-14 rounded-md ${
            connected
              ? "bg-blue-300 hover:bg-blue-400 active:bg-blue-500"
              : "bg-slate-200"
          } p-3`}
        />
        Send
      </button>
    </div>
  );
};

const ConnectButton = ({
  connected,
  connectWallet,
}: {
  connected: boolean;
  connectWallet: Function;
}) => {
  return (
    <div className="flex flex-col items-center gap-1 p-3">
      <button
        className="flex flex-col items-center"
        onClick={() => connectWallet()}
      >
        <PlusIcon
          className={`h-14 w-14 rounded-md ${
            connected ? "bg-slate-200" : "bg-blue-300"
          }  p-3 hover:bg-blue-400 active:bg-blue-500`}
        />
        {connected ? "Reconnect Wallet" : "Connect Wallet"}
      </button>
    </div>
  );
};

const ReceiveButton = ({ connected }: { connected: boolean }) => {
  return (
    <div
      className={`flex flex-col items-center gap-1 p-3 ${
        !connected && "text-slate-400"
      }`}
    >
      <ChevronDoubleDownIcon
        className={`h-14 w-14 rounded-md ${
          connected
            ? "bg-blue-300 hover:bg-blue-400 active:bg-blue-500"
            : "bg-slate-200"
        } p-3`}
      />
      Request
    </div>
  );
};

const WalletActions = ({
  connectWallet,
  sendTransaction,
  connected,
}: {
  connectWallet: Function;
  sendTransaction: Function;
  connected: boolean;
}) => {
  return (
    <div className="flex w-full max-w-2xl flex-row items-center justify-around rounded-xl bg-white pt-2 sm:w-3/4 lg:w-1/2">
      <SendButton connected={connected} sendTransaction={sendTransaction} />
      <ConnectButton connected={connected} connectWallet={connectWallet} />
      <ReceiveButton connected={connected} />
    </div>
  );
};

export default WalletActions;
