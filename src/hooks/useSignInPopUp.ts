import { useContext } from "react";
import { SignInPopUpContext } from "@/providers/SignInPopUpContextProvider";

export const useSignInPopUp = () => {
  const context = useContext(SignInPopUpContext);
  if (!context) {
    throw new Error("useSignInPopUp must be used with a SignInPopUpProvider");
  }

  return context;
};
