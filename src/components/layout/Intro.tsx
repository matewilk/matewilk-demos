import { useSignInPopUp } from "@/hooks/useSignInPopUp";

const Intro = () => {
  const { setIsSignInPopUpOpen } = useSignInPopUp();

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-20 text-center text-white sm:px-6 lg:px-8 lg:pt-32">
      <h1 className="mx-auto max-w-4xl text-8xl font-bold">
        Welcome to <span className="text-[#33BBFF]">@matewilk's</span> demo{" "}
        <span className="text-[#BB33FF]">page</span>
      </h1>
      <p className="mx-auto mt-6 max-w-xl text-lg">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu dui
        pulvinar, pharetra odio
      </p>
      <div className="mt-10 flex justify-center gap-x-6">
        <button
          onClick={() => setIsSignInPopUpOpen(true)}
          className="btn-black rounded-full0 group inline-flex items-center justify-center"
        >
          Sign up
        </button>
        <button
          onClick={() => setIsSignInPopUpOpen(true)}
          className="btn-white group inline-flex cursor-pointer items-center justify-center"
        >
          Sign in
        </button>
      </div>
    </div>
  );
};

export default Intro;
