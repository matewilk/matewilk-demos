import NewWindow from "react-new-window";
import { useSession } from "next-auth/react";
import { Dispatch, useState, createContext } from "react";

// TODO: define context type
export const SignInPopUpContext = createContext<any | null>(null);

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

export const SignInPopUpProvider = (props: any) => {
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
