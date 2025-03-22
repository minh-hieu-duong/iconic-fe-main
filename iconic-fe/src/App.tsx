import "./App.css";
import Video from "./components/Video";
import { ToastContainer } from "react-toastify";
function App() {
  return (
    <>
      <Video />
      <ToastContainer position="bottom-right" />
    </>
  );
}

export default App;
