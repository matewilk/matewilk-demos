import {
  act,
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { useEffect } from "react";
import { Client, createClient, WagmiConfig, useConnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { ethers } from "ethers";
import { generateTestingUtils } from "eth-testing";
import userEvent from "@testing-library/user-event";
import Wallet from "@/components/wallet/Wallet";

function WrapperGenerator(client: Client) {
  return function TestWagmiProvider(props: any) {
    return <WagmiConfig client={client} {...props} />;
  };
}

function MockConnect() {
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    connect();
  }, []);
  return null;
}

describe("Wallet", () => {
  const walletTestingUtils = generateTestingUtils({
    providerType: "MetaMask",
  });
  const mainnetReadonlyTestingUtils = generateTestingUtils();
  const goerliReadonlyTestingUtils = generateTestingUtils();

  let client: Client<any>;

  let originalEthereum: any;
  beforeAll(() => {
    originalEthereum = global.window.ethereum;
    global.window.ethereum = walletTestingUtils.getProvider();
  });

  afterAll(() => {
    global.window.ethereum = originalEthereum;
  });

  beforeEach(async () => {
    mainnetReadonlyTestingUtils.mockReadonlyProvider({ chainId: 1 });
    goerliReadonlyTestingUtils.mockReadonlyProvider({ chainId: 5 });

    const mainnetProvider = new ethers.providers.Web3Provider(
      mainnetReadonlyTestingUtils.getProvider()
    );
    await mainnetProvider.ready;

    const goerliProvider = new ethers.providers.Web3Provider(
      goerliReadonlyTestingUtils.getProvider()
    );
    await goerliProvider.ready;

    client = createClient({
      provider: ({ chainId }) =>
        chainId === 1 ? mainnetProvider : goerliProvider,
    });
  });

  afterEach(() => {
    walletTestingUtils.clearAllMocks();
  });

  it("renders connect wallet message and button", async () => {
    render(<Wallet />, { wrapper: WrapperGenerator(client) });

    const message = screen.getByRole("heading", {
      name: /Connect Wallet/i,
    });
    const button = screen.getByRole("button", {
      name: /Connect Wallet/i,
    });

    expect(message).toBeInTheDocument();
    expect(button).toBeInTheDocument();
  });

  it("renders balance and address after connecting wallet", async () => {
    walletTestingUtils.mockNotConnectedWallet();

    // After the eth_requestAccounts has resolved
    // - the account will be "0xf61B443A155b07D2b2cAeA2d99715dC84E839EEf",
    // - the chain will be "0x1",
    // - the block number will be "0x1"
    walletTestingUtils.mockRequestAccounts(
      ["0xf61B443A155b07D2b2cAeA2d99715dC84E839EEf"],
      {
        chainId: 1,
      }
    );
    mainnetReadonlyTestingUtils.mockBalance(
      "0xf61B443A155b07D2b2cAeA2d99715dC84E839EEf",
      // "0xde0b6b3a7640000" // 1.0 eth
      "0x6c6b935b8bbd400000" // 2000.0 eth
    );
    render(<Wallet />, { wrapper: WrapperGenerator(client) });

    const connectButton = screen.getByRole("button", {
      name: /connect wallet/i,
    });

    act(() => {
      userEvent.click(connectButton);
    });

    await waitForElementToBeRemoved(
      await screen.findByRole("heading", {
        name: /Connect Wallet/i,
      })
    );

    // balance
    await screen.findByText(/2000.0 ETH/i);
    // shortened address
    await screen.findByText(/0xf61B…9EEf/i);
  });

  it("updates wallet when user changes account", async () => {
    function mockConnect() {
      render(<MockConnect />, { wrapper: WrapperGenerator(client) });
    }
    // As the app state is reset, wagmi will not auto connect to newly created connectors
    // so there is a need to manually trigger the connection beforehand
    mockConnect();

    // Simulate a connected wallet
    walletTestingUtils.mockConnectedWallet([
      "0xf61B443A155b07D2b2cAeA2d99715dC84E839EEf",
    ]);
    mainnetReadonlyTestingUtils.mockBalance(
      "0xf61B443A155b07D2b2cAeA2d99715dC84E839EEf",
      "0x1bc16d674ec80000" // 2.0 eth
    );

    render(<Wallet />, { wrapper: WrapperGenerator(client) });

    // wait for connection
    await screen.findByText(/2.0 ETH/i);

    // Mock the balance of the new account
    mainnetReadonlyTestingUtils.mockBalance(
      "0x138071e4e810f34265bd833be9c5dd96f01bd8a5",
      "0xde0b6b3a7640000" // 1.0 eth
    );

    // Simulate a change of account
    act(() => {
      walletTestingUtils.mockAccountsChanged([
        "0x138071e4e810f34265bd833be9c5dd96f01bd8a5",
      ]);
    });

    // wait for new account connection
    await screen.findByText(/1.0 ETH/i);
  });

  it("updates wallet when user changes network", async () => {
    function mockConnect() {
      render(<MockConnect />, { wrapper: WrapperGenerator(client) });
    }
    // As the app state is reset, wagmi will not auto connect to newly created connectors
    // so there is a need to manually trigger the connection beforehand
    mockConnect();

    // Simulate a connected wallet
    walletTestingUtils.mockConnectedWallet([
      "0x138071e4e810f34265bd833be9c5dd96f01bd8a5",
    ]);
    mainnetReadonlyTestingUtils.mockBalance(
      "0x138071e4e810f34265bd833be9c5dd96f01bd8a5",
      "0x1bc16d674ec80000" // 2.0 eth
    );

    render(<Wallet />, { wrapper: WrapperGenerator(client) });

    // wait for connection
    await screen.findByText(/2.0 ETH/i);

    // Mock account balance on the new chain
    goerliReadonlyTestingUtils.mockBalance(
      "0x138071e4e810f34265bd833be9c5dd96f01bd8a5",
      "0x4563918244f40000" // 5.0 eth
    );

    // Simulate a change of chain (goerli 0x5)
    act(() => {
      walletTestingUtils.mockChainChanged("0x5");
    });

    // wait for new account connection
    await screen.findByText(/5.0 ETH/i);
  });

  it("removes balance view when user disconnects wallet", async () => {
    function mockConnect() {
      render(<MockConnect />, { wrapper: WrapperGenerator(client) });
    }
    // As the app state is reset, wagmi will not auto connect to newly created connectors
    // so there is a need to manually trigger the connection beforehand
    mockConnect();

    // Simulate a connected wallet
    walletTestingUtils.mockConnectedWallet([
      "0x138071e4e810f34265bd833be9c5dd96f01bd8a5",
    ]);

    render(<Wallet />, { wrapper: WrapperGenerator(client) });

    // wait for connection
    await screen.findByText(/d8a5/i);

    // disconnect wallet
    const connectButton = screen.getByRole("button", {
      name: /disconnect wallet/i,
    });
    act(() => {
      userEvent.click(connectButton);
    });

    await screen.findByRole("heading", {
      name: /Connect Wallet/i,
    });
  });
});
