import { ReactNode } from "react";
import { Tab } from "@headlessui/react";

const TabHorizontal = ({ children }: { children: ReactNode }) => {
  return (
    <Tab
      className={({ selected }: { selected: boolean }) => {
        return `w-full rounded-full border-none p-2 text-lg focus:outline-none  ${
          selected
            ? "bg-white text-blue-600 hover:text-blue-800"
            : "text-blue-100 hover:bg-blue-400 hover:text-white"
        }`;
      }}
    >
      {children}
    </Tab>
  );
};

const TabPannel = ({ children }: { children: ReactNode }) => {
  return (
    <Tab.Panel className="flex h-52 items-center justify-center rounded-lg bg-white">
      {children}
    </Tab.Panel>
  );
};

const Tabs = () => {
  return (
    <Tab.Group>
      <Tab.List className="flex flex-row justify-around gap-5 p-4">
        <TabHorizontal>Connect</TabHorizontal>
        <TabHorizontal>Send</TabHorizontal>
        <TabHorizontal>Receive</TabHorizontal>
      </Tab.List>
      <Tab.Panels className="rounded-xl pb-6">
        <TabPannel>Content 1</TabPannel>
        <TabPannel>Content 2</TabPannel>
        <TabPannel>Content 3</TabPannel>
      </Tab.Panels>
    </Tab.Group>
  );
};

export default Tabs;

const TabVertical = ({ children }: { children: ReactNode }) => {
  return (
    <Tab
      className={({ selected }: { selected: boolean }) => {
        return `w-full rounded-xl border-none py-4 text-lg focus:outline-none sm:rounded-r-none  ${
          selected
            ? "bg-white text-blue-600 hover:text-blue-800"
            : "text-blue-100 hover:bg-blue-400 hover:text-white"
        }`;
      }}
    >
      {children}
    </Tab>
  );
};

const TabsVertical = () => {
  return (
    <div className="sm:min-h-64 flex h-auto flex-col py-5 sm:flex-row sm:py-0">
      <Tab.Group vertical>
        <Tab.List className="w-full flex-auto sm:w-1/4 sm:py-10">
          <TabVertical>Tab 1</TabVertical>
          <TabVertical>Tab 2</TabVertical>
          <TabVertical>Tab 3</TabVertical>
        </Tab.List>
        <Tab.Panels className="sm:flex-1/4 w-full flex-auto pt-5 sm:right-0 sm:w-3/4 sm:py-6">
          <TabPannel>Content 1</TabPannel>
          <TabPannel>Content 2</TabPannel>
          <TabPannel>Content 3</TabPannel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export { TabsVertical };
