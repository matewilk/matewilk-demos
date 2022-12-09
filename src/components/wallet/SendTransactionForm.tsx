import { useState, Dispatch, SetStateAction } from "react";
import { useDebounce } from "use-debounce";
import { usePrepareSendTransaction, useSendTransaction } from "wagmi";
import { utils } from "ethers";
import { useForm, SubmitHandler } from "react-hook-form";

import { getGasPrice, sumFloats, multiplyFloats } from "@/utils/ethereum";
import { useWallet } from "@/hooks/useWallet";
import { useCoinGecko } from "@/hooks/useCoinGecko";
import { DisplayTxError } from "@/components/wallet/DisplayTxError";
import { TransactionSummary } from "./TransactionSummary";
import { TransactionActions } from "./TransactionActions";

type Inputs = {
  address: string;
  amount: string;
};

export const SendTransactionForm = ({
  showSendForm,
  setShowSendForm,
}: {
  showSendForm: boolean;
  setShowSendForm: Dispatch<SetStateAction<boolean>>;
}) => {
  // get gas data from WalletProvider
  const { gas, balance, transaction } = useWallet();
  const { data: balanceData } = balance;
  const {
    isFetching,
    data: {
      formatted: { gasPrice, maxFeePerGas },
    },
  } = gas;
  const { isLoading, isSuccess, isError, setTxHash } = transaction;

  // send transaction form state
  const [to, setTo] = useState("");
  const [debouncedTo] = useDebounce(to, 500);

  const [amount, setAmount] = useState("");
  const [debouncedAmount] = useDebounce(amount, 500);

  const [sentAmount, setSentAmount] = useState("");

  // get eth price in fiat from CoinGecko
  const eth = useCoinGecko(debouncedAmount);

  // prepare transaction
  const { config, error: prepareTxError } = usePrepareSendTransaction({
    request: {
      to: debouncedTo,
      value: debouncedAmount ? utils.parseEther(debouncedAmount) : undefined,
    },
  });

  // send transaction handlers
  const {
    data: txData,
    sendTransaction,
    error: txError,
  } = useSendTransaction({
    ...config,
    onSuccess() {
      // set sent amount to display in TransactionSummary
      setSentAmount(debouncedAmount);
      // reset form on successfull tx send
      resetForm();
    },
  });

  // update tx hash in WalletProvider
  // which uses useWaitForTransaction hook internally
  // and its result is used in TransactionHistory component
  setTxHash(txData?.hash);

  const ethGasPrice = getGasPrice(gasPrice as string);
  const ethMaxGasPrice = getGasPrice(maxFeePerGas as string);

  // UI display values
  const total = sumFloats([debouncedAmount || "0", ethGasPrice]);
  const totalMax = sumFloats([debouncedAmount || "0", ethMaxGasPrice]);

  const amountFiat = multiplyFloats(
    [debouncedAmount],
    eth?.ethereum?.gbp as number
  );
  const feeFiat = multiplyFloats([ethGasPrice], eth?.ethereum?.gbp as number);

  const totalFiat = multiplyFloats(
    [ethGasPrice, debouncedAmount],
    eth?.ethereum?.gbp as number
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<Inputs>({
    mode: "onSubmit",
    defaultValues: {
      address: "",
      amount: "",
    },
  });

  const resetForm: () => void = (): void => {
    setTo("");
    setAmount("");
  };

  const onCancel: () => void = (): void => {
    setShowSendForm(false);
    resetForm();
  };

  const onSubmit: SubmitHandler<Inputs> = (/* data */) => {
    sendTransaction?.();
  };

  const animateVisibility = `${
    showSendForm ? "visible opacity-100 pt-5" : "invisible opacity-0"
  } transition-all duration-300 ease-in`;

  return (
    <form
      className={`flex w-full flex-col gap-2 ${animateVisibility}`}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col">
        <label htmlFor="address">Recipient address</label>
        <input
          id="address"
          {...register("address", {
            required: "recipient address is required",
            validate: (value) => {
              const isValid = utils.isAddress(value);
              if (!isValid) {
                return "invalid ethereum address (cheksum or format)";
              }
            },
          })}
          aria-label="Recipient address"
          placeholder="0xA0Cf…342e"
          className="h-8 rounded bg-slate-50"
          onChange={(e) => {
            setTo(e.target.value);
            setValue("address", e.target.value);
          }}
          value={to}
          disabled={isLoading}
        />
        <p className="text-sm text-red-600">{errors.address?.message}</p>
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
            {...register("amount", {
              required: "eth amount is required",
              // pattern: {
              //   // matches agains 18 decimal places
              //   value: /^\d+(\.\d{0,18})?$/,
              //   message: "invalid amount format",
              // },
            })}
            aria-label="Amount (ether)"
            placeholder="0.5"
            className="h-8 grow rounded bg-slate-50"
            onChange={(e) => {
              const re = /^\d+(\.\d{0,18})?$/;
              if (e.target.value === "" || re.test(e.target.value)) {
                setValue("amount", e.target.value);
                setAmount(e.target.value);
              }
            }}
            value={amount}
            disabled={isLoading}
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
        <p className="text-sm text-red-600">{errors.amount?.message}</p>
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
            readOnly
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
            readOnly
          />
          <input
            id="total-fiat"
            aria-label="Total (fiat)"
            placeholder={`£ ${
              isNaN(parseFloat(totalFiat)) ? feeFiat : totalFiat
            }`}
            className="h-8 rounded bg-slate-50"
            readOnly
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
        <TransactionActions isLoading={isLoading} onCancel={onCancel} />
      </div>

      <div className="flex justify-center">
        <DisplayTxError prepareTxError={prepareTxError} txError={txError} />
        <TransactionSummary
          isSuccess={isSuccess}
          isError={isError}
          amount={sentAmount}
          txHash={txData?.hash}
          symbol={balanceData?.symbol}
        />
      </div>
    </form>
  );
};
