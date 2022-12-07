import {
  EtherscanProvider,
  TransactionResponse,
} from "@ethersproject/providers";
import { useEffect, useState } from "react";
import { utils } from "ethers";
import {
  ArrowsRightLeftIcon,
  ChevronDoubleDownIcon,
  ChevronDoubleUpIcon,
} from "@heroicons/react/24/outline";

import { useWallet } from "@/hooks/useWallet";

const TransactionHistory = () => {
  return (
    <section
      // flex-grow to make container flex-grow to fill remaining space
      className="flex-grow bg-slate-50 md:py-10"
      id="transactions"
      aria-label="transactions"
    >
      <div className="mx-auto max-w-3xl rounded-lg bg-white">
        <TxTable />
      </div>
    </section>
  );
};

export default TransactionHistory;

// sort array desc by date
const sortTxByDate = (txs: TransactionResponse[]) => {
  return txs.sort((a: any, b: any) => b.timestamp - a.timestamp);
};

// show day and month as name of month of timestamp
const formatDate = (timestamp: number) => {
  const date = new Date(timestamp * 1000);
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "short" });
  const year = date.getFullYear();

  return { day, month, year };
};

// show icon if equal to address
const txIcon = (to: string, from: string) => {
  if (to === from) {
    return <ArrowsRightLeftIcon className="mx-auto h-5 w-5 text-gray-400" />;
  }
  if (to === "0xd0C8837f161F0f6546D29FeBeB1F530bA66b5010") {
    return <ChevronDoubleDownIcon className="mx-auto h-5 w-5 text-green-400" />;
  }
  if (from === "0xd0C8837f161F0f6546D29FeBeB1F530bA66b5010") {
    return <ChevronDoubleUpIcon className="mx-auto h-5 w-5 text-red-400" />;
  }
};

const TxTableRow = ({
  timestamp,
  hash,
  from,
  to,
  value,
}: {
  timestamp: string;
  hash: `0x${string}`;
  from: `0x${string}`;
  to: `0x${string}`;
  value: string;
}) => {
  const { day, month } = formatDate(Number(timestamp));
  return (
    <tr className="border-b text-center last:border-b-0 hover:bg-stone-100">
      <th scope="row" className="whitespace-nowrap py-4 px-4 font-medium">
        {day} {month}
      </th>
      <td className="py-4 px-4">
        {parseFloat(utils.formatEther(value)).toFixed(8)}
      </td>

      <td className="py-4 px-4">{txIcon(to, from)}</td>
      <td className="py-4 px-4 text-xs">{from}</td>
      <td className="py-4 px-4 text-blue-500">
        <a target="_blank" href={`https://etherscan.io/tx/${hash}`}>
          etherscan.io
        </a>
      </td>
    </tr>
  );
};

const AnimatedRow = () => {
  return (
    <tr className="h-12 animate-pulse rounded-xl border-b bg-slate-100 last:border-b-0">
      <th className="w-16">
        <p className="m-auto h-5 w-3/4 rounded bg-slate-200"></p>
      </th>
      <td>
        <p className="m-auto h-5 w-3/4 rounded bg-slate-200"></p>
      </td>
      <td className="w-16">
        <p className="m-auto h-5 w-3/4 rounded bg-slate-200"></p>
      </td>
      <td className="w-72">
        <p className="m-auto h-5 w-3/4 rounded bg-slate-200"></p>
      </td>
      <td>
        <p className="m-auto h-5 w-3/4 rounded bg-slate-200"></p>
      </td>
    </tr>
  );
};

const TxTable = () => {
  const { account } = useWallet();
  const { isConnected, isDisconnected, address } = account;

  const [history, setHistory] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const getHistory = async () => {
      if (isConnected) {
        setIsLoading(true);
        const provider = new EtherscanProvider();
        const currentBlock = await provider.getBlockNumber();
        const blockTime = 15; // ETH block time is 15 seconds

        //Block number 2 hours, 24 hours and 48 hours ago
        const block2 = currentBlock - (480 * 60 * 60) / blockTime;
        const block24 = currentBlock - (24 * 60 * 60) / blockTime;
        const block48 = currentBlock - (48 * 60 * 60) / blockTime;

        // // Get all txs for address since 2 hours ago
        let history = await provider.getHistory(
          address as string,
          block2,
          currentBlock
        );

        // If you got nothing back (i.e no txns), try 24 hours and then 48 hours
        history.length === 0
          ? (history = await provider.getHistory(
              address as string,
              block24,
              currentBlock
            ))
          : null;
        history.length === 0
          ? (history = await provider.getHistory(
              address as string,
              block48,
              currentBlock
            ))
          : null;

        // Sort by date desc
        const txsHistory = sortTxByDate(history);

        setHistory(txsHistory);
        setIsLoading(false);
      }
      if (isDisconnected) setHistory([]);
    };

    getHistory();
  }, [isConnected, isDisconnected, address]);

  return (
    <div className="relative overflow-x-auto">
      <table className="w-full text-sm">
        {/* <thead className="uppercase">
          <tr>
            {headers.map((header, index) => (
              <th key={index} scope="col" className="py-3 px-4 text-center">
                {header}
              </th>
            ))}
          </tr>
        </thead> */}
        <tbody>
          {isLoading ? (
            <>
              <AnimatedRow />
              <AnimatedRow />
              <AnimatedRow />
            </>
          ) : null}
          {history.map((tx: any) => (
            <TxTableRow
              key={tx.hash}
              timestamp={tx.timestamp}
              hash={tx.hash}
              from={tx.from}
              to={tx.to}
              value={tx.value}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

const headers = ["date", "link", "direction", "from", "value"];