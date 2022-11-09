const Intro = () => {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-20 text-center sm:px-6 lg:px-8 lg:pt-32">
      <h1 className="mx-auto max-w-4xl text-5xl">Crypto made simple.</h1>
      <p className="mx-auto mt-6 max-w-xl text-lg text-slate-700">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu dui
        pulvinar, pharetra odio
      </p>
      <div className="mt-10 flex justify-center gap-x-6">
        <a
          href="/api/auth/signin"
          className="btn-black rounded-full0 group inline-flex items-center justify-center"
        >
          Sign up
        </a>
        <a
          href="/api/auth/signin"
          className="btn-white group inline-flex cursor-pointer items-center justify-center"
        >
          Sign in
        </a>
      </div>
    </div>
  );
};

export default Intro;
