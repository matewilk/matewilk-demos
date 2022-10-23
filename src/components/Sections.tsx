import Section from "../components/Section";
import Tabs, { TabsVertical } from "../components/Tabs";
import FaqsGrid from "../components/FaqsGrid";
import { ReactNode } from "react";

type SectionData = {
  id: string;
  header: string;
  subheader: string;
  children?: ReactNode | undefined;
};

const sections: SectionData[] = [
  {
    id: "features",
    header: "Everything you need to exchange your tokens.",
    subheader: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    children: <Tabs />,
  },
  {
    id: "about",
    header: "Simplify everyday token operations.",
    subheader: "Etiam eu dui pulvinar, pharetra odio.",
    children: <TabsVertical />,
  },
  {
    id: "getstarted",
    header: "Get started today.",
    subheader: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
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
              headerText={header}
              subheaderText={subheader}
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
