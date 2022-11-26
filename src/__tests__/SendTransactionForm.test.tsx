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
const contextValue = {
  gas: {
    isFetching: false,
    data: {
      formatted: {
        gasPrice: "0.000000002345",
        maxFeePerGas: "0.000000006789",
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
  it("should display correctly", async () => {
    // const { usePrepareSendTransaction } = await import("wagmi");
    render(<SendTransactionForm setShowSendForm={() => {}} />, {
      wrapper: Wrapper(),
    });

    screen.logTestingPlaygroundURL();
  });
});
