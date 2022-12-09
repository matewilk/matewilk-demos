export const DisplayTxError = ({
  prepareTxError,
  txError,
}: {
  prepareTxError: any;
  txError: any;
}) => {
  if (!prepareTxError && !txError) return null;

  if (prepareTxError?.message?.includes("insufficient funds")) {
    return (
      <div className="text-sm text-red-600">
        <div>Insufficient funds</div>
      </div>
    );
  }

  if (txError?.message?.includes("user rejected")) {
    return (
      <div className="text-sm text-red-600">
        <div>User rejected transaction</div>
      </div>
    );
  }

  return null;
};
