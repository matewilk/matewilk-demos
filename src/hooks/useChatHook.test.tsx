import { renderHook, waitFor, act } from "@testing-library/react";
import { ApolloProvider } from "@apollo/client";

import { useChat } from "@/hooks/useChat";
import { ReactElement } from "react";

import { apolloClient } from "@/helpers/webSocketClient";

const wrapper = ({
  children,
}: {
  children: ReactElement;
}): ReactElement<any, any> | null => (
  <ApolloProvider client={apolloClient()}>{children}</ApolloProvider>
);

describe("useChat", () => {
  it("returns messages", async () => {
    const { result } = renderHook(() => useChat({ chatId: "test" }), {
      wrapper,
    });
    await waitFor(() => {
      expect(result.current.messages).toHaveLength(2);
    });
  });

  it.only("returns a function to send messages", async () => {
    const { result } = renderHook(() => useChat({ chatId: "test" }), {
      wrapper,
    });

    const [sendMessage] = result.current.sendMessageMutation;

    await waitFor(() => {
      expect(sendMessage).toBeInstanceOf(Function);
    });
  });

  it("sends messages", async () => {
    const { result } = renderHook(() => useChat({ chatId: "test" }), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.messages).toHaveLength(2);
    });

    act(() => {
      result.current.observer.next({
        data: {
          chat: {
            message: "test observer",
          },
        },
      });
    });

    await waitFor(() => {
      expect(result.current.messages).toHaveLength(3);
    });
  });
});
