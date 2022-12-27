import { renderHook, waitFor, act } from "@testing-library/react";
import { ApolloProvider } from "@apollo/client";

import { useChat } from "@/hooks/useChat";
import { ReactElement } from "react";

import { apolloClient } from "@/hooks/useWebSocketClient";

const wrapper = ({
  children,
}: {
  children: ReactElement;
}): ReactElement<any, any> | null => (
  <ApolloProvider client={apolloClient()}>{children}</ApolloProvider>
);

describe("useChat", () => {
  it("returns empty messages array on init", async () => {
    const { result } = renderHook(() => useChat({ chatId: "test" }), {
      wrapper,
    });
    await waitFor(() => {
      expect(result.current.messages).toHaveLength(0);
    });
  });

  it("returns a function to send messages", async () => {
    const { result } = renderHook(() => useChat({ chatId: "test" }), {
      wrapper,
    });

    const [sendMessage] = result.current.mutation;

    await waitFor(() => {
      expect(sendMessage).toBeInstanceOf(Function);
    });
  });
});
