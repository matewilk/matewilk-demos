import "../styles/globals.css";
import type { AppType } from "next/app";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { SignInPopUpProvider } from "@/providers/SignInPopUpContextProvider";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <SignInPopUpProvider>
        <Component {...pageProps} />
      </SignInPopUpProvider>
    </SessionProvider>
  );
};

export default MyApp;
