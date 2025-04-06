import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Messages from "./pages/Messages";
import Projects from "./pages/Projects";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
};

export default App;
