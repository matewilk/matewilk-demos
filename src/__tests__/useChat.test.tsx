import { renderHook, waitFor } from "@testing-library/react";

import { useChat } from "@/hooks/useChat";

describe("useChat", () => {
  it("returns messages", async () => {
    const { result } = renderHook(() => useChat());
    await waitFor(() => {
      expect(result.current.messages).toHaveLength(2);
    });
  });

  it("returns a function to send messages", async () => {
    const { result } = renderHook(() => useChat());
    await waitFor(() => {
      expect(result.current.sendMessage).toBeInstanceOf(Function);
    });
  });
});
