import { render } from "@testing-library/react";

import SignInPage from "./signin";

const signIn = jest.fn();
const useSession = jest.fn().mockImplementation(() => ({
  data: false,
  status: "unauthenticated",
}));

jest.mock("next-auth/react", () => ({
  signIn: (args: string) => signIn(args),
  useSession: () => useSession(),
}));

describe("SignInPage", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should call signIn next-auth method if not authenticated", () => {
    render(<SignInPage />);

    expect(signIn).toHaveBeenCalledWith("google");
  });

  it("should not call signIn next-auth method if authenticated", () => {
    useSession.mockReturnValue({
      data: true,
    });

    render(<SignInPage />);

    expect(signIn).not.toBeCalled();
  });
});
