import { renderWithAppProviders, screen } from "@/utils/test-utils";

import Wallet from "@/pages/wallet";

describe("Wallet", () => {
  it("renders a heading", async () => {
    renderWithAppProviders(<Wallet />);

    const heading = await screen.findByRole("heading", {
      name: /Connect Wallet/i,
    });

    expect(heading).toBeInTheDocument();
  });
});
