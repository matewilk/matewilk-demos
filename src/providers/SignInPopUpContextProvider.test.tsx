import { render, screen } from "@testing-library/react";
import { useContext, useEffect } from "react";

import {
  SignInPopUpProvider,
  SignInPopUpContext,
} from "./SignInPopUpContextProvider";

const useSessionMock = jest.fn().mockImplementation(() => ({
  data: false,
  status: "unauthenticated",
}));
jest.mock("next-auth/react", () => ({
  useSession: () => useSessionMock(),
}));

jest.mock("react-new-window", () => ({
  __esModule: true,
  default: jest.fn(() => <div>SignInPopUp Window</div>),
}));

const TestComponent = () => {
  const { SignInPopUp, setIsSignInPopUpOpen } = useContext(SignInPopUpContext);

  useEffect(() => {
    setIsSignInPopUpOpen(true);
  }, []);

  return <div>{SignInPopUp}</div>;
};

describe("SignInPopUpContextProvider", () => {
  it("should return ready to render SignInPopUp window", () => {
    render(
      <SignInPopUpProvider>
        <TestComponent />
      </SignInPopUpProvider>
    );

    expect(screen.getByText("SignInPopUp Window")).toBeInTheDocument();
  });

  it("should return null if session exists", () => {
    useSessionMock.mockReturnValue({
      data: true,
    });

    render(
      <SignInPopUpProvider>
        <TestComponent />
      </SignInPopUpProvider>
    );

    expect(screen.queryByText("SignInPopUp Window")).not.toBeInTheDocument();
  });
});
