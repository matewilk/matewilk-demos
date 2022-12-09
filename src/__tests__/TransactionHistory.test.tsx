import { screen, render, waitFor } from "@testing-library/react";
import { ethers } from "ethers";

const mockUseWallet = jest.fn();
jest.mock("@/hooks/useWallet", () => ({
  useWallet: () => mockUseWallet(),
}));

const mockGetHistory = jest.fn();
jest.mock("@ethersproject/providers", () => ({
  ...jest.requireActual("@ethersproject/providers"),
  EtherscanProvider: jest.fn().mockImplementation(() => ({
    getHistory: () => mockGetHistory(),
    getBlockNumber: () => Promise.resolve(1),
  })),
}));

import TransactionHistory from "@/components/wallet/TransactionHistory";

describe("TransactionHistory", () => {
  it("displays transactions placeholder", async () => {
    mockUseWallet.mockReturnValue({
      account: {
        address: undefined,
        isConnected: false,
      },
    });
    mockGetHistory.mockReturnValue([]); // no transactions

    render(<TransactionHistory />);

    await screen.findByText(/No transaction history to display/i);
  });

  it("displays loading animated rows", async () => {
    mockUseWallet.mockReturnValue({
      account: {
        address: "0x1234",
        isConnected: true,
      },
    });
    mockGetHistory.mockResolvedValue(
      new Promise((resolve) => setTimeout(() => resolve, 3000))
    );

    render(<TransactionHistory />);

    await waitFor(() => {
      expect(screen.getAllByTestId("animated-loading-row").length).toBe(3);
    });
  });

  it("renders tx history rows", async () => {
    mockUseWallet.mockReturnValue({
      account: {
        address: "0x1234",
        isConnected: true,
      },
    });
    mockGetHistory.mockReturnValue([
      {
        hash: "0x1234",
        data: "0x",
        from: "0x12345",
        to: "0x1234",
        value: ethers.BigNumber.from("0x56ca6b5e2ef3e0000"), // 100.06286536 ETH
        timestamp: 1670537413, // 8 Dec 2022
      },
      {
        hash: "0x12345",
        data: "0x",
        from: "0x1234",
        to: "0x1234",
        value: ethers.BigNumber.from("0x56ca6b5e2ef3e000"), // 6.25392908 ETH
        timestamp: 1670450404, // 7 Dec 2022
      },
      {
        hash: "0x12346",
        data: "0x",
        from: "0x1234",
        to: "0x123456",
        value: ethers.BigNumber.from("0x56ca6b5e2ef3e00"), // 0.39087057 ETH
        timestamp: 1670364004, // 6 Dec 2022
      },
    ]);

    render(<TransactionHistory />);

    await waitFor(() => {
      expect(screen.getByText("8 Dec")).toBeInTheDocument();
      expect(screen.getByText("100.06286536")).toBeInTheDocument();
      expect(screen.getByText("0x12345")).toBeInTheDocument();

      expect(screen.getByText("7 Dec")).toBeInTheDocument();
      expect(screen.getByText("6.25392908")).toBeInTheDocument();
      expect(screen.getAllByText("0x1234")[0]).toBeInTheDocument();

      expect(screen.getByText("6 Dec")).toBeInTheDocument();
      expect(screen.getByText("0.39087057")).toBeInTheDocument();
      expect(screen.getAllByText("0x1234")[0]).toBeInTheDocument();
    });
  });
});
