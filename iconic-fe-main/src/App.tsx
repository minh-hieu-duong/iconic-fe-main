import { useState } from "react";
import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Info from "./components/Info";
import Video from "./components/Video";
import Note from "./components/Note";

function App() {
  const [activeTab, setActiveTab] = useState("video");

  return (
    <>
      <Header />
      <div className="text-sm font-medium text-center flex justify-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
        <ul className="flex flex-wrap -mb-px">
          <li className="me-2">
            <a
              onClick={() => setActiveTab("video")}
              className={`inline-block text-lg p-6 border-b-2 rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 cursor-pointer ${
                activeTab === "video"
                  ? "text-blue-600 border-blue-600"
                  : "border-transparent"
              }`}
            >
              Video
            </a>
          </li>
          <li className="me-2">
            <a
              onClick={() => setActiveTab("about")}
              className={`inline-block text-lg p-6 border-b-2 rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 cursor-pointer ${
                activeTab === "about"
                  ? "text-blue-600 border-blue-600"
                  : "border-transparent"
              }`}
            >
              About
            </a>
          </li>
          <li className="me-2">
            <a
              onClick={() => setActiveTab("note")}
              className={`inline-block text-lg p-6 border-b-2 rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 cursor-pointer ${
                activeTab === "note"
                  ? "text-blue-600 border-blue-600"
                  : "border-transparent"
              }`}
            >
              Note
            </a>
          </li>
        </ul>
      </div>

      {activeTab === "about" && <Info />}
      {activeTab === "video" && <Video />}
      {activeTab === "note" && <Note />}

      <Footer />
    </>
  );
}

export default App;
