import { render, screen } from "@/utils/test-utils";

import ChatPage, { getServerSideProps } from "@/pages/chats/[id]";

// eslint-disable-next-line react/display-name
jest.mock("@/components/layout/Header", () => () => <div>Header</div>);
// eslint-disable-next-line react/display-name
jest.mock("@/components/layout/SignIn", () => () => <div>Sign in mock</div>);

const useSession = jest.fn().mockImplementation(() => ({
  data: false,
  status: "unauthenticated",
}));
jest.mock("next-auth/react", () => ({
  useSession: () => useSession(),
}));

jest.mock("@/server/common/get-server-auth-session", () => ({
  getServerAuthSession: () => ({}),
}));

describe("ChatPage", () => {
  const chatId = "1";
  const history = [
    {
      id: "1",
      text: "Hello",
      userId: "1",
      userName: "User 1",
    },
  ];

  it("should render sign in page if session does not exist", () => {
    render(<ChatPage query={{ id: chatId }} history={history} />);

    screen.getByText("Sign in mock");
  });

  it("should render a chat page if session exist", () => {
    useSession.mockReturnValue({
      data: {
        user: {
          id: "1",
        },
        status: "authenticated",
      },
    });

    render(<ChatPage query={{ id: chatId }} history={history} />);

    screen.getByRole("button", { name: /send/i });
  });
});
