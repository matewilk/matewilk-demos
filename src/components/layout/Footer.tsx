const Footer = () => {
  return (
    <footer className="bg-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="place-content-center py-6">
          <img src="favicon.ico" alt="" className="mx-auto h-12"></img>
        </div>
        <div className="flex flex-col items-center border-t border-slate-600 py-5 sm:flex-row-reverse sm:justify-between">
          <div className="flex gap-x-6 text-slate-500">
            <a
              href="https://github.com/matewilk"
              target="_blank"
              rel="noreferrer"
              className="group"
            >
              Git
            </a>
            <a
              href="https://www.linkedin.com/in/matewilk/"
              target="_blank"
              rel="noreferrer"
              className="group"
            >
              In
            </a>
          </div>
          <p className="mt-6 text-sm text-slate-500 sm:mt-0">
            Copyright © 2022. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
