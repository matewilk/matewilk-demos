import { jest } from "@jest/globals";

jest.unstable_mockModule("wagmi", () => ({
  usePrepareSendTransaction: jest.fn(() => "mocked"),
}));

describe("mock module", () => {
  it("should return mocked values", async () => {
    const { usePrepareSendTransaction } = await import("wagmi");

    expect(usePrepareSendTransaction()).toBe("mocked");
  });
});
