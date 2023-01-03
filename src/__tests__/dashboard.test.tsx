import { renderWithAppProviders, screen } from "@/utils/test-utils";

import Dashboard from "@/pages/dashboard";

describe("Dashboard", () => {
  it("renders a heading", async () => {
    renderWithAppProviders(<Dashboard />);

    const heading = await screen.findByRole("heading", {
      name: /Connect Wallet/i,
    });

    expect(heading).toBeInTheDocument();
  });
});
