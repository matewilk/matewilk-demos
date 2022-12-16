import { screen, render, waitFor, fireEvent } from "@testing-library/react";
import { Chat } from "@/components/chat/Chat";

jest.mock("@/hooks/useChat", () => ({
  useChat: () => ({
    messages: [
      { id: "1", text: "Hello", sender: "user" },
      { id: "2", text: "Hi", sender: "other" },
    ],
  }),
}));

describe("ChatWindow", () => {
  beforeEach(() => {
    render(<Chat />);
  });

  it("renders messages", async () => {
    await waitFor(() => {
      expect(screen.getByText("Hello")).toBeInTheDocument();
      expect(screen.getByText("Hi")).toBeInTheDocument();
    });
  });

  it("renders message when user sends message", async () => {
    await waitFor(() => {
      expect(screen.getByText("Hello")).toBeInTheDocument();
      expect(screen.getByText("Hi")).toBeInTheDocument();
    });

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "Hello World" },
    });
    fireEvent.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(screen.getByText("Hello World")).toBeInTheDocument();
    });
  });
});
