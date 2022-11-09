import { ReactNode } from "react";

const SectionType = {
  textColor: {
    header: { blue: "text-white", white: "text-black" },
    subheader: { blue: "text-blue-100", white: "text-gray-800" },
  },
  bgColor: { blue: "bg-blue-600", white: "bg-white " },
};

enum Type {
  BLUE = "blue",
  WHITE = "white",
}

type Section = {
  type: `${Type}`;
  sectionId: string;
  headerText: string;
  subheaderText: string;
  children?: ReactNode;
};

const Section = ({
  type,
  sectionId,
  headerText,
  subheaderText,
  children,
}: Section) => {
  return (
    <section
      id={sectionId}
      aria-label={headerText}
      className={`overflow-hidden ${SectionType.bgColor[type]} pt-20 pb-28 sm:py-32`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl text-center md:mx-auto md:text-center xl:max-w-none">
          <h2
            className={`font-display text-3xl tracking-tight ${SectionType.textColor.header[type]} sm:text-4xl md:text-5xl`}
          >
            {headerText}
          </h2>
          <p
            className={`mt-6 text-lg tracking-tight ${SectionType.textColor.subheader[type]}`}
          >
            {subheaderText}
          </p>
        </div>
      </div>
      <div className="mt-20 max-w-5xl text-center sm:mx-auto sm:text-center">
        {children}
      </div>
    </section>
  );
};

export default Section;
