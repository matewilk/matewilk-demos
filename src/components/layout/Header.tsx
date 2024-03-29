import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";

import { useSignInPopUp } from "@/hooks/useSignInPopUp";

type MenuItem = { text: string; href: string };

const menuItems: MenuItem[] = [
  {
    text: "Home",
    href: "/#",
  },
  {
    text: "Wallet",
    href: "/wallet",
  },
  {
    text: "Chats",
    href: "/chats",
  },
  {
    text: "FAQs",
    href: "/#faqs",
  },
];

const MenuItem = ({ text, href }: MenuItem) => {
  const { pathname, asPath } = useRouter();
  const active = asPath === href || pathname === href;
  return (
    <Link href={href}>
      <li
        className={`${
          active ? "text-fuchsia-500" : ""
        } text group relative mx-2 transform cursor-pointer py-2 px-2 text-lg transition duration-500 hover:text-fuchsia-500`}
      >
        {text}
        <span className="absolute left-0 bottom-0 inline-block h-[2px] w-full origin-top-right scale-0 bg-fuchsia-500 align-middle transition-transform duration-500 group-hover:origin-top-left group-hover:scale-100"></span>
      </li>
    </Link>
  );
};

const Header = () => {
  const [open, setOpenMobileMenu] = useState(false);

  const { setIsSignInPopUpOpen, SignInPopUp } = useSignInPopUp();
  const { status } = useSession();
  const authenticated = status === "authenticated";

  return (
    <header
      id="intro"
      className="sticky top-0 z-50 h-16 border-b border-white border-opacity-20 bg-[#2e026d] text-white shadow-lg"
    >
      <div
        id="nav-container"
        className={`${
          open ? "" : "border-b-0"
        } relative z-50 flex flex-col items-end border-b border-white border-opacity-20 pt-2  md:mx-auto md:max-w-5xl md:border-b-0`}
      >
        <div id="img-container" className="absolute left-2 top-2 h-12 w-12">
          <img src="/favicon.ico" alt="" className="h-12 w-12"></img>
        </div>
        <div
          id="nav-icon"
          onClick={() => setOpenMobileMenu(!open)}
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
          } xs:shadow-lg w-full space-y-2 bg-[#2e026d] p-3 text-center font-thin md:flex md:h-12 md:flex-row md:items-center md:justify-start md:space-x-5 md:space-y-0 md:pl-16 md:shadow-none`}
        >
          {menuItems.map((item, index) => (
            <MenuItem key={index} href={item.href} text={item.text} />
          ))}
          {authenticated ? (
            <>
              <li className="btn-white md:absolute md:right-2">
                <button onClick={() => signOut()}>Sign out</button>
              </li>
            </>
          ) : (
            <>
              <li className="btn-white md:absolute md:right-2">
                <button onClick={() => setIsSignInPopUpOpen(true)}>
                  Sign in
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
      {SignInPopUp}
    </header>
  );
};

export default Header;
