import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { generateTestingUtils } from "eth-testing";
import userEvent from "@testing-library/user-event";
import Dashboard from "@/pages/dashboard";

describe("Dashboard", () => {
  const testingUtils = generateTestingUtils({ providerType: "MetaMask" });

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

    testingUtils.mockNotConnectedWallet();

    testingUtils.mockRequestAccounts([address]);

    render(<Dashboard />);

    const connectButton = await screen.findByRole("button", {
      name: /Connect Wallet/i,
    });
    userEvent.click(connectButton);

    const connectHeading = screen.getByRole("heading", {
      name: /Connect Wallet/i,
    });
    await waitForElementToBeRemoved(connectHeading);

    expect(screen.getByText(new RegExp(shortAddress, "i")));
  });
});
