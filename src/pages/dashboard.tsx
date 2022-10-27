import type { NextPage } from "next";
import Header from "../components/Header";

import {
  ChevronDoubleUpIcon,
  ChevronDoubleDownIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

const headers = ["token", "value", "quantity", "symbol"];

const tokens = [
  {
    token: "Ether",
    value: "$10,453.44",
    quantity: "3.23489234",
    symbol: "ETH",
  },
  {
    token: "Solana",
    value: "$15,653.21",
    quantity: "332.47293434",
    symbol: "SOL",
  },
  {
    token: "Polygon",
    value: "10,453.44",
    quantity: "343.234834",
    symbol: "MATIC",
  },
  {
    token: "Tether",
    value: "$12,000.00",
    quantity: "12000.00",
    symbol: "USDT",
  },
];

const TokenTableRow = ({
  token,
  value,
  quantity,
  symbol,
}: {
  token: string;
  value: string;
  quantity: string;
  symbol: string;
}) => {
  return (
    <tr className="border-b text-center last:border-b-0 hover:bg-stone-100">
      <th scope="row" className="whitespace-nowrap py-4 px-4 font-medium">
        {token}
      </th>
      <td className="py-4 px-4">{value}</td>
      <td className="py-4 px-4">{quantity}</td>
      <td className="py-4 px-4">{symbol}</td>
    </tr>
  );
};

const TokenTable = () => {
  return (
    <div className="relative overflow-x-auto pt-5">
      <table className="w-full text-sm">
        <thead className="uppercase">
          <tr>
            {headers.map((header, index) => (
              <th key={index} scope="col" className="py-3 px-4 text-center">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tokens.map((token, index) => (
            <TokenTableRow
              key={index}
              token={token.token}
              value={token.value}
              quantity={token.quantity}
              symbol={token.symbol}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

const WalletBalance = () => {
  return (
    <div className="h-72 w-full max-w-2xl rounded-xl bg-white p-10 sm:w-3/4 lg:w-1/2">
      <div>
        <span>Total Balance</span>
        <div>
          <h3 className="py-5 text-3xl">$ 10,3534.32</h3>
        </div>
      </div>
      <div className="mt-10">
        <span>Monthly change</span>
        <div>
          <h3 className="py-3 text-2xl">$ 1,264.05</h3>
        </div>
      </div>
    </div>
  );
};

const WalletActions = () => {
  return (
    <div className="flex w-full max-w-2xl flex-row items-center justify-around rounded-xl bg-white pt-2 sm:w-3/4 lg:w-1/2">
      <div className="flex flex-col items-center gap-1 p-3">
        <ChevronDoubleUpIcon className="h-14 w-14 rounded-md bg-slate-200 p-3" />
        Send
      </div>
      <div className="flex flex-col items-center gap-1">
        <PlusIcon className="h-14 w-14 rounded-md bg-slate-200 p-3" />
        Connect Wallet
      </div>
      <div className="flex flex-col items-center gap-1">
        <ChevronDoubleDownIcon className="h-14 w-14 rounded-md bg-slate-200 p-3" />
        Receive
      </div>
    </div>
  );
};

const Dashboard: NextPage = () => {
  return (
    <>
      <Header signedIn={true} />
      <section id="balance" aria-label="balance">
        <div className="mx-auto flex h-min max-w-7xl flex-col items-center justify-between gap-10 bg-blue-100 py-10">
          <WalletBalance />
          <WalletActions />
        </div>
      </section>
      <section id="portfolio" aria-label="portfolio">
        <div className="mx-auto max-w-3xl">
          <TokenTable />
        </div>
      </section>
    </>
  );
};

export default Dashboard;
