import * as React from "react";
import { renderHook } from "@testing-library/react";

import {
  SignInPopUpContext,
  type SignInPopUpContextType,
} from "@/providers/SignInPopUpContextProvider";
import { useSignInPopUp } from "./useSignInPopUp";

jest.mock("next-auth/react", () => ({
  useSession: jest.fn(() => ({
    data: null,
    status: "loading",
  })),
}));

const mockUseContext = {
  test: "test",
} as unknown as SignInPopUpContextType;

const wrapper = ({
  children,
}: {
  children: React.ReactElement;
}): React.ReactElement<any, any> | null => (
  <SignInPopUpContext.Provider value={mockUseContext}>
    {children}
  </SignInPopUpContext.Provider>
);

describe("useSignInPopUp", () => {
  beforeEach(() => {
    // spy on console.error to prevent (jsdom) from logging an error to the console
    // https://github.com/facebook/jest/issues/5785
    jest.spyOn(console, "error").mockImplementation(() => {
      /* noop */
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should throw an error if used outside of a SignInPopUpProvider", () => {
    expect(() => renderHook(() => useSignInPopUp())).toThrowError(
      "useSignInPopUp must be used with a SignInPopUpProvider"
    );
  });

  it("should return the context if used inside of a SignInPopUpProvider", () => {
    const { result } = renderHook(() => useSignInPopUp(), { wrapper });

    expect(result.current).toEqual(mockUseContext);
  });
});
