import React, { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";

import { SessionProvider } from "next-auth/react";
import { SignInPopUpProvider } from "@/providers/SignInPopUpContextProvider";

const AllTheProviders = ({ children }: { children: ReactElement }) => {
  return (
    <SessionProvider>
      <SignInPopUpProvider>{children}</SignInPopUpProvider>
    </SessionProvider>
  );
};

const renderWithAppProviders = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "queries">
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from "@testing-library/react";
export { renderWithAppProviders };
