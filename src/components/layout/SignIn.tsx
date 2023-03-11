import { useSignInPopUp } from "@/hooks/useSignInPopUp";

const PleaseSignIn = () => {
  const { setIsSignInPopUpOpen } = useSignInPopUp();

  return (
    // h-1 defines hegith of parent element
    // and makes child (whith h-full) grow to fill height
    <section id="chat" aria-label="chat" className="h-1 flex-grow">
      <div className="mx-auto h-full max-w-3xl">
        <div className="flex h-full flex-col items-center justify-center">
          <h3 className="p-2 text-xl">Sign in to access the page</h3>
          <button
            className="btn-black rounded-full0 group inline-flex items-center justify-center"
            onClick={() => setIsSignInPopUpOpen(true)}
          >
            Sign in
          </button>
        </div>
      </div>
    </section>
  );
};

export default PleaseSignIn;
