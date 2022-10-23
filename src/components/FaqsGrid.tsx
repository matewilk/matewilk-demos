import { ReactNode } from "react";
import { faqs } from "../pages/content";

const FaqCell = ({ children }: { children: ReactNode }) => {
  return <div className="p-2">{children}</div>;
};

const FaqsGrid = () => {
  return (
    <div className="p-5 text-start">
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3">
        {faqs.map(({ question, answer }, index) => {
          return (
            <FaqCell key={index}>
              <h3 className="text-xl font-bold">{question}</h3>
              <div className="pt-4">{answer}</div>
            </FaqCell>
          );
        })}
      </div>
    </div>
  );
};

export default FaqsGrid;
