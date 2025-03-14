import "./App.css";
import Footer from "./components/Footer";
import Video from "./components/Video";
import { ToastContainer } from "react-toastify";
function App() {
  return (
    <>
      <div className="flex items-center gap-3 bg-black p-4 md:p-5 rounded-t-lg border-b border-gray-800">
        <img
          src="https://cdn.iconscout.com/icon/premium/png-256-thumb/i-51-833313.png?f=webp&w=256"
          alt="Logo"
          className="w-8 h-8 md:w-10 md:h-10 rounded-full flex-shrink-0  z-10"
        />
        <h1 className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent text-3xl md:text-4xl font-extrabold tracking-wide drop-shadow-md">
          Iconic
        </h1>
      </div>

      <Video />
      <ToastContainer />

      <Footer />
    </>
  );
}

export default App;
