import { renderWithAppProviders } from "@/utils/test-utils";

import Home from "@/pages/index";

describe("Home", () => {
  it("renders a heading", () => {
    const { container } = renderWithAppProviders(<Home />);

    expect(container).toHaveTextContent(/Welcome to matewilk\'s demo page/i);
  });
});
