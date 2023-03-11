import { render, screen, fireEvent, waitFor } from "@testing-library/react";

import { MessageForm } from "./MessageForm";

// mock useSession - does not require to be wrapped in ApolloProvider
const useSession = jest.fn().mockImplementation(() => ({
  data: {
    user: { id: "1" },
  },
  status: "authenticated",
}));

jest.mock("next-auth/react", () => ({
  useSession: () => useSession(),
}));

describe("MessageForm", () => {
  const sendMock = jest.fn();
  beforeEach(() => {
    render(
      <MessageForm sendMessage={sendMock} chatId={"1"} error={undefined} />
    );
  });

  it("has send button disabled when message is empty", () => {
    const sendButton = screen.getByRole("button", { name: /send/i });

    expect(sendButton).toBeDisabled();
  });

  it("has send button enabled when message is not empty", async () => {
    const messageInput: HTMLInputElement = screen.getByRole("textbox", {
      name: /message/i,
    });
    const sendButton = screen.getByRole("button", { name: /send/i });

    fireEvent.input(messageInput, { target: { value: "test message" } });

    await waitFor(() => {
      expect(messageInput.value).toBe("test message");
      expect(sendButton).toBeEnabled();
    });
  });

  it("sends a message successfully", async () => {
    const messageInput = screen.getByRole("textbox", { name: /message/i });
    const sendButton = screen.getByRole("button", { name: /send/i });

    fireEvent.change(messageInput, { target: { value: "test message" } });
    fireEvent.submit(sendButton);

    await waitFor(() => {
      expect(sendMock).toHaveBeenCalledWith({
        variables: {
          text: "test message",
          chatId: "1",
          userId: "1",
        },
      });
    });
  });

  it("shows error message when there is error", async () => {
    render(
      <MessageForm
        sendMessage={sendMock}
        chatId={"1"}
        error={"error message"}
      />
    );

    const errorMessage = screen.getByText(/something went wrong/i);

    await waitFor(() => {
      expect(errorMessage).toBeInTheDocument();
    });
  });
});
