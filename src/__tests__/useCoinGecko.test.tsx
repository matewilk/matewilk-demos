import { renderHook, waitFor } from "@testing-library/react";
import { setupServer } from "msw/node";
import { rest } from "msw";

import { useCoinGecko } from "@/hooks/useCoinGecko";

// setup mock server
const handers = [
  rest.get("https://api.coingecko.com/api/v3/simple/price", (req, res, ctx) => {
    return res(
      ctx.json({
        ethereum: {
          gbp: 1000,
          usd: 1200,
          eur: 1400,
        },
      })
    );
  }),
];
const server = setupServer(...handers);

describe("useCoinGecko", () => {
  beforeAll(() => {
    server.listen();
  });
  afterEach(() => server.resetHandlers());
  afterAll(() => {
    server.close();
  });

  it("should return ethereum data", async () => {
    const { result } = renderHook(() => useCoinGecko(1));

    await waitFor(() => {
      expect(result.current).toEqual({
        ethereum: {
          gbp: 1000,
          usd: 1200,
          eur: 1400,
        },
      });
    });
  });
});
