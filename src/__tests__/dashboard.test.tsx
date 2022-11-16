import { render, screen } from "@testing-library/react";
import Dashboard from "@/pages/dashboard";

describe("Dashboard", () => {
  it("renders a heading", async () => {
    render(<Dashboard />);

    const heading = await screen.findByRole("heading", {
      name: /Connect Wallet/i,
    });

    expect(heading).toBeInTheDocument();
  });
});
