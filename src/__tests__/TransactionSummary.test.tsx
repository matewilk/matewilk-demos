import { screen, render, waitFor } from "@testing-library/react";

import { TransactionSummary } from "@/components/wallet/TransactionSummary";

describe("TransactionSummary", () => {
  it("renders success summary", async () => {
    render(
      <TransactionSummary
        isSuccess={true}
        isError={false}
        amount="1"
        txHash="0x1234"
        symbol="ETH"
      />
    );

    await screen.findByText(/Successfully sent 1 ETH/i);
    await screen.findByText(/see details on etherscan.io/i);
  });

  it("renders error summary", async () => {
    render(
      <TransactionSummary
        isSuccess={false}
        isError={true}
        amount="1"
        txHash="0x1234"
        symbol="ETH"
      />
    );

    await screen.findByText(/Something went wrong. Please try again./i);
  });
});
