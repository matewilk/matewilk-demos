const Footer = () => {
  return (
    <footer className="bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="h-12 w-full place-content-center py-16">
          <img src="favicon.ico" alt="" className="mx-auto h-12"></img>
        </div>
        <div className="border-slate-40 flex flex-col items-center border-t py-10 sm:flex-row-reverse sm:justify-between">
          <div className="flex gap-x-6 text-slate-500">
            <a href="#" className="group">
              In
            </a>
            <a href="#" className="group">
              Git
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
