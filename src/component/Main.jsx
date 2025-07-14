import ChatWindow from "./ChatWindow";
import Split from 'react-split';
import { useState } from "react";
import Content from "./Content";
import Quizzes from "./Quizzes";
import Notes from "./Notes";
import Header from "./Header";

const tabs = [
  { name: 'Content', Component: <Content /> },
  { name: 'Quizzes', Component: <Quizzes /> },
  { name: 'Notes', Component: <Notes /> }
];

const Main = () => {
  const [activeTab, setActiveTab] = useState("Quizzes");

  return (
    <>
    <div className="bg-[url('/bg3.svg')] bg-no-repeat bg-cover">
      <Header />
      <Split
        className="flex h-[calc(100vh-64px)]" // Adjust height to account for Header
        gutterClassName="custom-gutter"
        sizes={[50, 50]}
        minSize={[550, 300]}
        gutterSize={2}
        direction="horizontal"
      >
        <div className="h-full bg-transparent">
          <ChatWindow />
        </div>
        <div className="h-full bg-transparent ">
          <div className=" text-white flex flex-col h-full">
            <div className="flex space-x-6 border-b border-gray-700 px-6 py-4">
              {tabs.map((tab) => (
                <button
                  key={tab.name}
                  className={`text-lg font-medium ${
                    activeTab === tab.name ? "text-blue-400 border-b-2 border-blue-400" : "text-gray-400"
                  }`}
                  onClick={() => setActiveTab(tab.name)}
                >
                  {tab.name}
                </button>
              ))}
            </div>
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar ">
              {tabs.find((tab) => tab.name === activeTab)?.Component}
            </div>
          </div>
        </div>
      </Split>
    </div>
    </>
  );
};

export default Main;