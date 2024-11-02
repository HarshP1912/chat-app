import { Route, Routes } from "react-router-dom";
import "./App.css";
import Homepage from "./Pages/Homepage";
import ChatPage from "./Pages/ChatPage";

function App() {
  return (
      <div className="App">
        <Routes>
          <Route path="/" Component={Homepage} />
          <Route path="/chats" Component={ChatPage} />
        </Routes>
      </div>
  );
}

export default App;
