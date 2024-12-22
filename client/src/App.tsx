import "./App.css";
import ChatsPage from "./pages/ChatsPage";
import HomePage from "./pages/HomePage";
import { Route, Routes } from "react-router";
function App() {
  return (
    <div className="app bg-black text-white">
      <Routes>
      <Route path="/" element ={<HomePage/>} />
      <Route path="/chats" element={<ChatsPage/>} />
      </Routes>
    </div>
  );
}

export default App;
