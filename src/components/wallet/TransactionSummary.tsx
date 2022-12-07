export const TransactionSummary = ({
  isSuccess,
  isError,
  amount,
  txHash,
  symbol,
}: {
  isSuccess: boolean;
  isError: boolean;
  amount: string;
  txHash: `0x${string}` | undefined;
  symbol: string;
}) => {
  return (
    <>
      {isSuccess ? (
        <div className="flex flex-col items-center pt-5">
          <div>
            Successfully sent {amount} {symbol}
          </div>
          <div className="text-blue-500">
            <a target="_blank" href={`https://etherscan.io/tx/${txHash}`}>
              see details on etherscan.io
            </a>
          </div>
        </div>
      ) : null}

      {isError ? (
        <div className="pt-5 text-red-600">
          Something went wrong. Please try again.
        </div>
      ) : null}
    </>
  );
};
