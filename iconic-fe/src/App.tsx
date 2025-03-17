import "./App.css";
import Footer from "./components/Footer";
import Video from "./components/Video";
import { ToastContainer } from "react-toastify";
function App() {
  return (
    <>
      <Video />
      <ToastContainer />

      <Footer />
    </>
  );
}

export default App;
