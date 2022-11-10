import {
  act,
  waitFor,
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { generateTestingUtils } from "eth-testing";
import userEvent from "@testing-library/user-event";
import Dashboard from "@/pages/dashboard";

describe("Dashboard", () => {
  const testingUtils = generateTestingUtils({
    verbose: false,
    providerType: "MetaMask",
  });

  let originalEthereum: any;
  beforeAll(() => {
    originalEthereum = global.window.ethereum;
    global.window.ethereum = testingUtils.getProvider();
  });

  afterAll(() => {
    global.window.ethereum = originalEthereum;
  });

  afterEach(() => {
    testingUtils.clearAllMocks();
  });

  it("renders a connect wallet message and button", () => {
    render(<Dashboard />);

    const message = screen.getByRole("heading", {
      name: /Connect Wallet/i,
    });
    const button = screen.getByRole("button", {
      name: /Connect Wallet/i,
    });

    expect(message).toBeInTheDocument();
    expect(button).toBeInTheDocument();
  });

  it("allows user to connect crypto wallet", async () => {
    const address = "0x489a163D00bA8411E3B30C7488c9F6f0EDf5CC3e";
    const shortAddress = "CC3e";

    act(() => {
      testingUtils.mockNotConnectedWallet();
      testingUtils.mockRequestAccounts([address]);
      render(<Dashboard />);
    });

    await act(async () => {
      const connectButton = await screen.findByRole("button", {
        name: /Connect Wallet/i,
      });
      userEvent.click(connectButton);
    });

    const connectHeading = screen.getByRole("heading", {
      name: /Connect Wallet/i,
    });
    await waitForElementToBeRemoved(connectHeading);

    const walletAddress = await screen.findByText(
      new RegExp(shortAddress, "i")
    );
    await waitFor(() => expect(walletAddress).toBeInTheDocument());
  });

  it("allows user with connected wallet to see wallet info", async () => {
    const address = "0x489a163D00bA8411E3B30C7488c9F6f0EDf5CC3e";
    const eth = "0xde0b6b3a7640000"; // 1 ETH
    testingUtils.mockConnectedWallet([address]);
    testingUtils.mockBalance(address, eth);

    render(<Dashboard />);

    await screen.findByText(/1.00/);
  });
});
