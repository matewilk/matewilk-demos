import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import {
  usePrepareSendTransaction,
  useSendTransaction,
  useFeeData,
} from "wagmi";
import { BigNumberish, utils } from "ethers";
import CoinGecko from "coingecko-api";

const coinGeckoClient = new CoinGecko();

export const SendTransactionForm = ({
  setShowSendForm,
}: {
  setShowSendForm: Function;
}) => {
  const [to, setTo] = useState("");
  const [debouncedTo] = useDebounce(to, 500);

  const [amount, setAmount] = useState("");
  const [debouncedAmount] = useDebounce(amount, 500);

  const { data, isFetching } = useFeeData({
    formatUnits: "ether",
    watch: true,
  });

  const gasPrice = data?.gasPrice;
  const maxFeePerGas = data?.maxFeePerGas;

  const { config } = usePrepareSendTransaction({
    request: {
      to: debouncedTo,
      value: debouncedAmount ? utils.parseEther(debouncedAmount) : undefined,
    },
  });
  const { sendTransaction } = useSendTransaction(config);

  const total = debouncedAmount
    ? utils.parseUnits(debouncedAmount).add(gasPrice as BigNumberish)
    : gasPrice;

  const maxTotal = debouncedAmount
    ? utils.parseUnits(debouncedAmount).add(maxFeePerGas as BigNumberish)
    : maxFeePerGas;

  const [eth, setEthPrice] = useState();
  const amountInFiat = parseFloat(debouncedAmount) * eth?.ethereum?.gbp;
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
  }, []);

  return (
    <form
      className="flex w-full flex-col gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        // sendTransaction?.(); // <<---- START FROM HERE !!!
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
            placeholder="£50"
            className="h-8 rounded bg-slate-50"
            value={amountInFiat}
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
            placeholder="0.0005"
            className={`${
              isFetching ? "text-slate-300" : "text-gray-500"
            } h-8 grow rounded bg-slate-50`}
            value={data?.formatted.gasPrice || undefined}
          />
          <input
            id="gas-fiat"
            aria-label="Gas (fiat)"
            placeholder="£2.36"
            className="h-8 rounded bg-slate-50"
          />
        </div>
        <div className="flex flex-row justify-between pt-1 text-sm text-gray-500">
          <div>{"Likely in < 30 seconds"}</div>
          <div
            className={`${
              isFetching ? "text-slate-400" : "text-gray-500"
            } transition-all duration-200 ease-in-out`}
          >
            Max fee: {data?.formatted.maxFeePerGas}
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
            placeholder="0.5"
            className={`${
              isFetching ? "text-slate-400" : "text-gray-500"
            } h-8 grow rounded bg-slate-50`}
            value={utils.formatUnits(total as BigNumberish)}
          />
          <input
            id="total-fiat"
            aria-label="Total (fiat)"
            placeholder="£52.36"
            className="h-8 rounded bg-slate-50"
          />
        </div>
        <div className="flex flex-row justify-between pt-1 text-sm text-gray-500">
          <div>{"Amount + gas fee"}</div>
          <div
            className={`${
              isFetching ? "text-slate-400" : "text-gray-500"
            } transition-all duration-200 ease-in-out`}
          >
            Max total: {utils.formatUnits(maxTotal as BigNumberish)}
          </div>
        </div>
      </div>

      <div className="mt-5 flex w-full flex-col justify-center gap-5 md:flex-row">
        <button className="btn-white" onClick={() => setShowSendForm(false)}>
          Cancel
        </button>
        <button className="btn-blue">Send</button>
      </div>
    </form>
  );
};
