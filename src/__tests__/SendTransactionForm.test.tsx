import { WagmiConfig } from "wagmi";
import { createClient, configureChains, defaultChains } from "wagmi";
import { publicProvider } from "wagmi/providers/public";

// prepare wagmi provider
const { provider } = configureChains(defaultChains, [publicProvider()]);
const client = createClient({
  autoConnect: true,
  provider,
});

import { screen, render } from "@testing-library/react";
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

describe("SendTransactionForm", () => {
  it("displays correctly", async () => {
    // const { usePrepareSendTransaction } = await import("wagmi");
    render(<SendTransactionForm setShowSendForm={() => {}} />, {
      wrapper: Wrapper(),
    });

    // screen.logTestingPlaygroundURL();
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
    it("validates address as expected", () => {});
  });

  describe("Amount (ether) field", () => {
    it("allows numeric values only", () => {});

    it("has a character limit of 18 decimal places", () => {});

    it("updates amount (fiat) field", () => {});

    it("updates total (ether) & total (fiat) fields", () => {});
  });

  describe("Send form button", () => {
    it("is enabled when fields are filled in correctly", () => {});

    it("changes text when form is being sent", () => {});
  });
});
