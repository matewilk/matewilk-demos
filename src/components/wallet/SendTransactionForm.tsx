import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import {
  usePrepareSendTransaction,
  useSendTransaction,
  useWaitForTransaction,
} from "wagmi";
import { utils } from "ethers";
import CoinGecko from "coingecko-api";

import { getGasPrice } from "@/utils/ethereum";
import { useWallet } from "@/hooks/useWallet";

type CGFiatType = {
  gbp: number;
  usd: number;
  eur: number;
};

type CGSimplePriceResponseType = {
  ethereum: CGFiatType;
};

const coinGeckoClient = new CoinGecko();

export const SendTransactionForm = ({
  setShowSendForm,
}: {
  setShowSendForm: Function;
}) => {
  // get gas data from WalletProvider
  const {
    gas: {
      isFetching,
      data: {
        formatted: { gasPrice, maxFeePerGas },
      },
    },
  } = useWallet();

  // state to keep CoinGecko response in
  const [eth, setEthPrice]: [
    eth: CGSimplePriceResponseType | undefined,
    setEthPrice: Function
  ] = useState();

  // send transaction form state
  const [to, setTo] = useState("");
  const [debouncedTo] = useDebounce(to, 500);

  const [amount, setAmount] = useState("");
  const [debouncedAmount] = useDebounce(amount, 500);

  // TODO: move CoinGecko logic to Provider
  useEffect(() => {
    const getEthPrice = async () => {
      const { data, success } = await coinGeckoClient.simple.price({
        ids: ["ethereum"],
        vs_currencies: ["eur", "usd", "gbp"],
      });
      if (success) {
        setEthPrice(data);
      }
    };
    getEthPrice();
  }, [debouncedAmount]);

  // prepare transaction
  const { config } = usePrepareSendTransaction({
    request: {
      to: debouncedTo,
      value: debouncedAmount ? utils.parseEther(debouncedAmount) : undefined,
    },
  });

  // send transaction hanlers
  const { data, sendTransaction } = useSendTransaction(config);
  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  const ethGasPrice = getGasPrice(gasPrice as string);
  const ethMaxGasPrice = getGasPrice(maxFeePerGas as string);

  // UI display values
  const total = parseFloat(debouncedAmount || "0") + parseFloat(ethGasPrice);
  const totalMax =
    parseFloat(debouncedAmount || "0") + parseFloat(ethMaxGasPrice);

  const amountFiat = (
    parseFloat(debouncedAmount) * eth?.ethereum?.gbp!
  ).toFixed(2);

  const feeFiat = (parseFloat(ethGasPrice) * eth?.ethereum?.gbp!).toFixed(2);

  const totalFiat = (
    (parseFloat(ethGasPrice) + parseFloat(debouncedAmount)) *
    eth?.ethereum?.gbp!
  ).toFixed(2);

  return (
    <form
      className="flex w-full flex-col gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        sendTransaction?.(); // <<---- START FROM HERE !!!
      }}
    >
      <div className="flex flex-col">
        <label htmlFor="address">Recipient address</label>
        <input
          id="address"
          aria-label="Recipient"
          placeholder="0xA0Cf…342e"
          className="h-8 rounded bg-slate-50"
          onChange={(e) => setTo(e.target.value)}
          value={to}
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="asset">Asset</label>
        <input
          id="asset"
          aria-label="Asset"
          placeholder="ETH"
          className="h-8 rounded bg-slate-50"
          disabled
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="amount">Amount (ether)</label>
        <div className="flex flex-row gap-4">
          <input
            id="amount"
            aria-label="Amount (ether)"
            placeholder="0.5"
            className="h-8 grow rounded bg-slate-50"
            onChange={(e) => setAmount(e.target.value)}
            value={amount}
          />
          <input
            id="amount-fiat"
            aria-label="Amount (fiat)"
            placeholder={`£ ${
              isNaN(parseFloat(amountFiat)) ? "50" : amountFiat
            }`}
            className="h-8 rounded bg-slate-50"
            readOnly
          />
        </div>
      </div>

      <span className="mt-3 mb-1 h-0.5 w-full bg-slate-100"></span>

      <div className="flex flex-col">
        <label htmlFor="gas">Gas (ether)</label>
        <div className="flex flex-row gap-4">
          <input
            id="gas"
            aria-label="Gas (ether)"
            placeholder={ethGasPrice || "0.0005"}
            className={`${
              isFetching ? "text-slate-300" : "text-gray-500"
            } h-8 grow rounded bg-slate-50`}
            readOnly
          />
          <input
            id="gas-fiat"
            aria-label="Gas (fiat)"
            placeholder={`£ ${feeFiat || "2.36"}`}
            className="h-8 rounded bg-slate-50"
          />
        </div>
        <div className="flex flex-row justify-between pt-1 text-sm text-gray-500">
          <div>{"Likely in < 30 seconds"}</div>
          <div
            className={`${
              isFetching ? "text-slate-300" : "text-gray-500"
            } transition-all duration-200 ease-in-out`}
          >
            Max fee: {ethMaxGasPrice}
          </div>
        </div>
      </div>

      <span className="mt-3 mb-1 h-0.5 w-full bg-slate-100"></span>

      <div className="flex flex-col">
        <label htmlFor="Total">Total (ether)</label>
        <div className="flex flex-row gap-4">
          <input
            id="total"
            aria-label="Total (ether)"
            placeholder={total.toString()}
            className={`${
              isFetching ? "text-slate-300" : "text-gray-500"
            } h-8 grow rounded bg-slate-50`}
          />
          <input
            id="total-fiat"
            aria-label="Total (fiat)"
            placeholder={`£ ${
              isNaN(parseFloat(totalFiat)) ? feeFiat : totalFiat
            }`}
            className="h-8 rounded bg-slate-50"
          />
        </div>
        <div className="flex flex-row justify-between pt-1 text-sm text-gray-500">
          <div>{"Amount + gas fee"}</div>
          <div
            className={`${
              isFetching ? "text-slate-300" : "text-gray-500"
            } transition-all duration-200 ease-in-out`}
          >
            Max total: {totalMax}
          </div>
        </div>
      </div>

      <div className="mt-5 flex w-full flex-col justify-center gap-5 md:flex-row">
        <button className="btn-white" onClick={() => setShowSendForm(false)}>
          Cancel
        </button>
        <button className="btn-blue">
          {isLoading ? "Sending..." : "Send"}
        </button>
      </div>
      {isSuccess && (
        <div className="flex flex-col items-center pt-5">
          <div>Successfuly sent {amount} ETH</div>
          <div className="text-blue-500">
            <a target="_blank" href={`https://etherscan.io/tx/${data?.hash}`}>
              see details on etherscan.io
            </a>
          </div>
        </div>
      )}
    </form>
  );
};
