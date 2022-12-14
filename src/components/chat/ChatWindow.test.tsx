import { screen, render, waitFor } from "@testing-library/react";
import { ChatWindow } from "./ChatWindow";

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
    render(<ChatWindow />);
  });

  it("renders messages", async () => {
    await waitFor(() => {
      expect(screen.getByText("Hello")).toBeInTheDocument();
      expect(screen.getByText("Hi")).toBeInTheDocument();
    });
  });
});
