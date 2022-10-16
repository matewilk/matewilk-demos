const Intro = () => {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-20 text-center sm:px-6 lg:px-8 lg:pt-32">
      <h1 className="mx-auto max-w-4xl text-5xl">Crypto made simple.</h1>
      <p className="mx-auto mt-6 max-w-xl text-lg text-slate-700">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu dui
        pulvinar, pharetra odio
      </p>
      <div className="mt-10 flex justify-center gap-x-6">
        <a className="group inline-flex cursor-pointer items-center justify-center rounded-full bg-slate-900 py-2 px-4 font-bold text-white hover:bg-slate-700 hover:text-slate-100 focus:outline-none focus-visible:outline-2 focus-visible:outline-slate-900 active:bg-slate-800 active:text-slate-300">
          Sign up
        </a>
        <a className="group inline-flex cursor-pointer items-center justify-center rounded-full py-2 px-4 font-bold text-slate-700 ring-1 ring-slate-200 hover:text-slate-900 hover:ring-slate-300 focus:outline-none focus-visible:outline-black focus-visible:ring-slate-300 active:bg-slate-100 active:text-slate-600">
          Sign in
        </a>
      </div>
    </div>
  );
};

export default Intro;
