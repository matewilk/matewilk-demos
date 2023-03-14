import { ReactNode } from "react";

import Section from "./Section";
import FaqsGrid from "./FaqsGrid";
import Demos from "./Demos";

type SectionData = {
  id: string;
  header?: string | undefined;
  subheader?: string | undefined;
  children?: ReactNode | undefined;
};

const sections: SectionData[] = [
  {
    id: "demos",
    children: <Demos />,
  },
  {
    id: "faqs",
    header: "Frequently asked questions.",
    subheader:
      "If you can’t find what you’re looking for, email our support team and if you’re lucky someone will get back to you.",
    children: <FaqsGrid />,
  },
];

const Sections = () => {
  return (
    <>
      {sections.map(
        ({ id, header, subheader, children }: SectionData, index) => {
          return (
            <Section
              key={index}
              type={index % 2 === 0 ? "blue" : "white"}
              sectionId={id}
              headerText={header as string}
              subheaderText={subheader as string}
            >
              {children}
            </Section>
          );
        }
      )}
    </>
  );
};

export default Sections;
