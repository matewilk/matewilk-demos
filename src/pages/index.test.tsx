import { renderWithAppProviders, screen } from "@/utils/test-utils";

import Home from "@/pages/index";

describe("Home", () => {
  it("renders a heading", () => {
    renderWithAppProviders(<Home />);

    const heading = screen.getByRole("heading", {
      name: /Crypto made simple\./i,
    });

    expect(heading).toBeInTheDocument();
  });
});
