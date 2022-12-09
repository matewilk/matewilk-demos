import { WagmiConfig } from "wagmi";
import { createClient, configureChains, defaultChains } from "wagmi";
import { publicProvider } from "wagmi/providers/public";

// prepare wagmi provider
const { provider } = configureChains(defaultChains, [publicProvider()]);
const client = createClient({
  autoConnect: true,
  provider,
});

import {
  screen,
  render,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { WalletContext } from "../providers/WalletContextProvider";
import { SendTransactionForm } from "@/components/wallet/SendTransactionForm";

// mock useCoingGecko hook return values
jest.mock("../hooks/useCoinGecko", () => {
  return {
    useCoinGecko: () => {
      return {
        ethereum: {
          gbp: 1000,
        },
      };
    },
  };
});

// mock use-debounce to avoid using jest timers
jest.mock("use-debounce", () => {
  return {
    useDebounce: (value: string) => {
      return [value];
    },
  };
});

// mock wagmi - only hooks used in SendTransactionForm
// do not mock the rest - requireActual - to be able to setup this test file properly
const usePrepareSendTransactionMock = jest.fn();
const sendTransactionMock = jest.fn();
const useSendTransactionMock = jest.fn().mockImplementation(() => ({
  data: {
    hash: "0xmock",
  },
  sendTransaction: sendTransactionMock,
}));
jest.mock("wagmi", () => {
  return {
    ...jest.requireActual("wagmi"),
    usePrepareSendTransaction: () => usePrepareSendTransactionMock(),
    useSendTransaction: () => useSendTransactionMock(),
    useWaitForTransaction: jest
      .fn()
      .mockImplementation(() => ({ isLoading: false, isSuccess: false })),
  };
});

// useWallet hook mocked return value
const gasPrice = "0.000000002345";
const maxFeePerGas = "0.000000006789";
const contextValue = {
  gas: {
    isFetching: false,
    data: {
      formatted: {
        gasPrice,
        maxFeePerGas,
      },
    },
  },
  balance: {
    data: {
      symbol: "ETH",
    },
  },
  transaction: {
    isLoading: false,
    isSuccess: false,
    isError: false,
    setTxHash: jest.fn(),
  },
};

// wrap in wagmi and wallet providers
const Wrapper = () => {
  return function WagmiWalletWrapper(props: any) {
    return (
      <WagmiConfig client={client}>
        <WalletContext.Provider value={contextValue} {...props} />)
      </WagmiConfig>
    );
  };
};

const validAddress = "0x94CCbba1FE2a9fe68F328E40832858aB8730613F";

describe("SendTransactionForm", () => {
  beforeEach(() => {
    usePrepareSendTransactionMock.mockImplementation(() => ({
      config: "mock",
    }));

    render(
      <SendTransactionForm setShowSendForm={jest.fn()} showSendForm={true} />,
      {
        wrapper: Wrapper(),
      }
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("displays correctly", async () => {
    screen.getByText(/recipient address/i);
    const address = screen.getByRole("textbox", { name: /recipient/i });
    expect(address.getAttribute("placeholder")).toBe("0xA0Cf…342e");

    screen.getByText(/asset/i);
    const asset = screen.getByRole("textbox", { name: /asset/i });
    expect(asset.getAttribute("placeholder")).toBe("ETH");

    screen.getByText(/amount \(ether\)/i);
    const amountEth = screen.getByRole("textbox", {
      name: /amount \(ether\)/i,
    });
    expect(amountEth.getAttribute("placeholder")).toBe("0.5");

    const amountFiat = screen.getByRole("textbox", {
      name: /amount \(fiat\)/i,
    });
    expect(amountFiat.getAttribute("placeholder")).toBe("£ 50");

    screen.getByText(/gas \(ether\)/i);
    const gasEth = screen.getByRole("textbox", {
      name: /gas \(ether\)/i,
    });
    const gasEther = (21000 * parseFloat(gasPrice)).toFixed(8);
    expect(gasEth.getAttribute("placeholder")).toBe(gasEther);

    const gasFiat = screen.getByRole("textbox", {
      name: /gas \(fiat\)/i,
    });
    expect(gasFiat.getAttribute("placeholder")).toBe("£ 0.05");

    const maxFee = (21000 * parseFloat(maxFeePerGas)).toFixed(8);
    screen.getByText(`Max fee: ${maxFee}`);

    screen.getByText(/total \(ether\)/i);
    const totalEth = screen.getByRole("textbox", {
      name: /gas \(ether\)/i,
    });
    const totalEther = (21000 * parseFloat(gasPrice)).toFixed(8);
    expect(totalEth.getAttribute("placeholder")).toBe(totalEther);

    const maxTotal = (21000 * parseFloat(maxFeePerGas)).toFixed(8);
    screen.getByText(`Max total: ${maxTotal}`);

    screen.getByRole("button", { name: /cancel/i });
    screen.getByRole("button", { name: /send/i });
  });

  describe("Recipient address field", () => {
    it("displays error message when address field is empty", async () => {
      fireEvent.click(screen.getByText(/send/i));

      await screen.findByText(/recipient address is required/i);
    });

    it("validates address as expected", async () => {
      const address: HTMLInputElement = screen.getByRole("textbox", {
        name: /address/i,
      });
      fireEvent.change(address, { target: { value: validAddress } });

      fireEvent.click(screen.getByText(/send/i));

      await waitFor(() => {
        expect(address.value).toBe(validAddress);
      });
    });

    it("displays error message when address format is invalid", async () => {
      const invalidAddress = "0x94CCbba1FE2a9fe68F328E40832858aB8730613";
      const address = screen.getByRole("textbox", { name: /address/i });

      fireEvent.change(address, { target: { value: invalidAddress } });

      fireEvent.click(screen.getByText(/send/i));
      await screen.findByText(
        /invalid ethereum address \(cheksum or format\)/i
      );
    });
  });

  describe("Amount (ether) field", () => {
    it("allows numeric values only", async () => {
      const amount = screen.getByRole("textbox", { name: /amount \(ether\)/i });

      fireEvent.change(amount, { target: { value: "abc" } });
      expect(amount.getAttribute("value")).toBe("");

      fireEvent.change(amount, { target: { value: 0.567 } });
      await screen.findByDisplayValue("0.567");
    });

    it("has a character limit of 18 decimal places", async () => {
      const amount = screen.getByRole("textbox", { name: /amount \(ether\)/i });

      fireEvent.change(amount, { target: { value: "0.123456789123456789" } });
      await screen.findByDisplayValue("0.123456789123456789");

      // does not update field when value exceeds decimal places limit
      fireEvent.change(amount, { target: { value: "0.12345678912345678912" } });
      await screen.findByDisplayValue("0.123456789123456789");
    });

    it("updates amount (fiat) field", async () => {
      const amount = screen.getByRole("textbox", { name: /amount \(ether\)/i });
      const amountFiat = screen.getByRole("textbox", {
        name: /amount \(fiat\)/i,
      });

      fireEvent.change(amount, { target: { value: "0.56789" } });

      expect(amountFiat.getAttribute("placeholder")).toBe("£ 567.89");
    });

    it("updates total (ether), total (fiat) & max total values", async () => {
      const eth = "0.999";
      const amount = screen.getByRole("textbox", { name: /amount \(ether\)/i });
      const totalEther = screen.getByRole("textbox", {
        name: /total \(ether\)/i,
      });
      const totalFiat = screen.getByRole("textbox", {
        name: /total \(fiat\)/i,
      });

      fireEvent.change(amount, { target: { value: eth } });

      expect(totalEther.getAttribute("placeholder")).toBe("0.99904925");
      expect(totalFiat.getAttribute("placeholder")).toBe("£ 999.05");

      const maxTotal = (
        parseFloat(eth) +
        21000 * parseFloat(maxFeePerGas)
      ).toFixed(8);
      screen.getByText(`Max total: ${maxTotal}`);
    });
  });

  describe("Send form button", () => {
    it("Triggers transaction send when fields are filled in correctly", async () => {
      const address = screen.getByRole("textbox", { name: /address/i });
      const amount = screen.getByRole("textbox", { name: /amount \(ether\)/i });

      fireEvent.change(address, { target: { value: validAddress } });
      fireEvent.change(amount, { target: { value: "0.1" } });

      fireEvent.submit(screen.getByText(/send/i));

      await waitFor(() => expect(sendTransactionMock).toHaveBeenCalled());
    });

    it("does not trigger transaction send when fields are not filled in correctly", async () => {
      fireEvent.submit(screen.getByText(/send/i));

      await waitFor(() => expect(sendTransactionMock).not.toHaveBeenCalled());
    });
  });
});

describe("Transaction Errors", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("displays error message on insufficient funds preprare transaction error", async () => {
    usePrepareSendTransactionMock.mockReturnValue({
      config: "mock",
      error: { message: "insufficient funds" },
    });

    act(() => {
      render(
        <SendTransactionForm setShowSendForm={jest.fn()} showSendForm={true} />,
        {
          wrapper: Wrapper(),
        }
      );
    });

    await waitFor(() => {
      expect(screen.getByText(/insufficient funds/i)).toBeInTheDocument();
    });
  });

  it("displays error message when user rejects transaction", async () => {
    usePrepareSendTransactionMock.mockReturnValue({
      config: "mock",
    });
    useSendTransactionMock.mockReturnValue({
      data: {
        hash: "0xmock",
      },
      error: { message: "user rejected request" },
    });

    act(() => {
      render(
        <SendTransactionForm setShowSendForm={jest.fn()} showSendForm={true} />,
        {
          wrapper: Wrapper(),
        }
      );
    });

    await waitFor(() => {
      expect(
        screen.getByText(/User rejected transaction/i)
      ).toBeInTheDocument();
    });
  });

  it("does not show error message if is not handled", async () => {
    usePrepareSendTransactionMock.mockReturnValue({ config: "mock" });
    useSendTransactionMock.mockReturnValue({
      data: {
        hash: "0xmock",
      },
      error: { message: "mock error" },
    });

    act(() => {
      render(
        <SendTransactionForm setShowSendForm={jest.fn()} showSendForm={true} />,
        {
          wrapper: Wrapper(),
        }
      );
    });

    await waitFor(() => {
      expect(
        screen.queryByText(/User rejected transaction/i)
      ).not.toBeInTheDocument();
      expect(screen.queryByText(/insufficient funds/i)).not.toBeInTheDocument();
    });
  });
});
