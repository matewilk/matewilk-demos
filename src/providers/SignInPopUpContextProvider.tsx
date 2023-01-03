import NewWindow from "react-new-window";
import { useSession } from "next-auth/react";
import { Dispatch, useState, createContext, PropsWithChildren } from "react";

export type SignInPopUpContextType = {
  setIsSignInPopUpOpen: Dispatch<boolean>;
  SignInPopUp: JSX.Element | null;
};

export const SignInPopUpContext = createContext<SignInPopUpContextType | null>(
  null
);

const SignInPopUp = ({
  setIsSignInPopUpOpen,
}: {
  setIsSignInPopUpOpen: Dispatch<boolean>;
}) => {
  return (
    <NewWindow
      copyStyles={false}
      features={{
        width: 400,
        height: 600,
      }}
      url="/signin"
      onOpen={(e) => {
        const popupTick = setInterval(() => {
          if (e.closed) {
            clearInterval(popupTick);
            setIsSignInPopUpOpen(false);
          }
        }, 500);
      }}
    />
  );
};

export const SignInPopUpProvider = (props: PropsWithChildren) => {
  const [isSignInPopUpOpen, setIsSignInPopUpOpen] = useState(false);
  const { data: session } = useSession();

  const showSignInPopUp = isSignInPopUpOpen && !session;

  const SignInPopUpComponent = showSignInPopUp ? (
    <SignInPopUp setIsSignInPopUpOpen={setIsSignInPopUpOpen} />
  ) : null;

  const value = {
    setIsSignInPopUpOpen,
    SignInPopUp: SignInPopUpComponent,
  };

  return <SignInPopUpContext.Provider value={value} {...props} />;
};
