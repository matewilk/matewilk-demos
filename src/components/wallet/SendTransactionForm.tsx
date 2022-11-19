import { useState } from "react";
import { useDebounce } from "use-debounce";
import {
  usePrepareSendTransaction,
  useSendTransaction,
  useFeeData,
} from "wagmi";
import { utils, BigNumber } from "ethers";

const getTotal = (gasPrice: string, amount: string) => {
  // gasPrice (if) in wei -> convert to BigNumber
  //const bigGasPrice = BigNumber.from(gasPrice);

  // parseUnits - convert eth string (e.g 1.1) to BigNumber
  const bigGasPrice = utils.parseUnits(gasPrice);
  const bigAmount = utils.parseUnits(amount);
  // add two BigNumbers
  return utils.formatUnits(bigAmount.add(bigGasPrice));
};

export const SendTransactionForm = ({
  setShowSendForm,
}: {
  setShowSendForm: Function;
}) => {
  const [to, setTo] = useState("");
  const [debouncedTo] = useDebounce(to, 500);

  const [amount, setAmount] = useState("");
  const [debounceAmount] = useDebounce(amount, 500);

  const { data, isLoading } = useFeeData({
    formatUnits: "ether",
  });

  const gasPrice = data?.formatted.gasPrice;
  const maxFeePerGas = data?.formatted.maxFeePerGas;

  const { config } = usePrepareSendTransaction({
    request: {
      to: debouncedTo,
      value: debounceAmount ? utils.parseEther(debounceAmount) : undefined,
    },
  });
  const { sendTransaction } = useSendTransaction(config);

  // formatUntis convers wei -> eth
  // const ethGasPrice = utils.formatUnits(gasPrice);
  // const ethMaxGasPrice = utils.formatUnits(maxFeePerGas);

  const total = debounceAmount ? getTotal(gasPrice, debounceAmount) : gasPrice;

  const maxTotal = debounceAmount
    ? getTotal(maxFeePerGas, debounceAmount)
    : maxFeePerGas;

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
            className="h-8 grow rounded bg-slate-50"
            value={gasPrice}
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
          <div>Max fee: {maxFeePerGas}</div>
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
            className="h-8 grow rounded bg-slate-50"
            value={total}
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
          <div>Max total: {maxTotal}</div>
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
