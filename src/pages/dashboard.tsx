import type { NextPage } from "next";
import Header from "../components/layout/Header";
import Wallet from "../components/wallet/Wallet";
import { WalletProvider } from "../components/wallet/WalletContext";

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

const Dashboard: NextPage = () => {
  return (
    <WalletProvider>
      <Header signedIn={true} />
      <Wallet />
      <section id="portfolio" aria-label="portfolio">
        <div className="mx-auto max-w-3xl">
          <TokenTable />
        </div>
      </section>
    </WalletProvider>
  );
};

export default Dashboard;

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
