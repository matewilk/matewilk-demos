import { useState } from "react";

const Header = () => {
  const [open, setOpen] = useState(false);
  return (
    <header id="intro" className="sticky top-0 h-16 bg-white">
      <div id="img-container" className="absolute left-2 top-2 h-12 w-12">
        <img src="favicon.ico" alt="" className="h-full w-full"></img>
      </div>

      <div
        id="nav-container"
        className="z-50 flex flex-col items-end bg-white p-2"
      >
        <div
          id="nav-icon"
          onClick={() => setOpen(!open)}
          className="p2 group h-12 w-12 md:hidden"
        >
          <svg
            xmlns="<http://www.w3.org/2000/svg>"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-full w-full group-hover:fill-gray-600"
          >
            <path
              fillRule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        <ul
          id="nav-menu"
          className={`${
            open ? "" : "hidden"
          } w-full space-y-2 pr-3 text-center font-semibold md:flex md:h-12 md:flex-row md:items-center md:justify-start md:space-x-5 md:space-y-0 md:pl-16`}
        >
          <li className="hover:cursor-pointer hover:text-gray-600">
            <a href="/#intro">Intro</a>
          </li>
          <li className="hover:cursor-pointer hover:text-gray-600">
            <a href="/#features">Features</a>
          </li>
          <li className="hover:cursor-pointer hover:text-gray-600">
            <a href="/#about">About</a>
          </li>
          <li className="hover:cursor-pointer hover:text-gray-600">
            <a href="/#faqs">FAQs</a>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
