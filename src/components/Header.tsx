import { useState } from "react";

type MenuItem = { text: string; href: string };

const menuItems: MenuItem[] = [
  {
    text: "Intro",
    href: "/#intro",
  },
  {
    text: "Features",
    href: "/#features",
  },
  {
    text: "About",
    href: "/#about",
  },
  {
    text: "FAQs",
    href: "/#faqs",
  },
];

const dashItems: MenuItem[] = [
  {
    text: "Dashboard",
    href: "",
  },
  {
    text: "Connections",
    href: "",
  },
  {
    text: "Chats",
    href: "",
  },
];

const MenuItem = ({ text, href }: MenuItem) => {
  return (
    <li className="cursor-pointer rounded-full py-2 px-4 hover:bg-slate-100 hover:text-gray-600">
      <a href={href}>{text}</a>
    </li>
  );
};

const Header = ({ signedIn }: { signedIn: boolean }) => {
  const [open, setOpen] = useState(false);
  const [signed] = useState(signedIn);
  return (
    <header id="intro" className="sticky top-0 h-16 bg-white">
      <div
        id="nav-container"
        className="relative z-50 flex flex-col items-end bg-white p-2 md:mx-auto md:max-w-5xl"
      >
        <div id="img-container" className="absolute left-2 top-2 h-12 w-12">
          <img src="favicon.ico" alt="" className="h-12 w-12"></img>
        </div>
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
          {signed
            ? dashItems.map((item, index) => (
                <MenuItem key={index} href={item.href} text={item.text} />
              ))
            : menuItems.map((item, index) => (
                <MenuItem key={index} href={item.href} text={item.text} />
              ))}
          {signed ? (
            <>
              <li className="btn-blue md:absolute md:right-28">
                <a href="/games">Games</a>
              </li>
              <li className="btn-white md:absolute md:right-2">
                <a href="/api/auth/signout">Sign out</a>
              </li>
            </>
          ) : (
            <>
              <li className="btn-white md:absolute md:right-44">
                <a href="/api/auth/signin">Sign in</a>
              </li>
              <li className="btn-blue md:absolute md:right-2">
                <a href="/api/auth/signin">Get started today</a>
              </li>
            </>
          )}
        </ul>
      </div>
    </header>
  );
};

export default Header;
