import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Messages from "./pages/Messages";
import Projects from "./pages/Projects";
import SignUpLoginPage from "./pages/SignUp";
import SignUp from "./pages/CreateAccount";
import { useAuthContext } from "./services/userProvider";
import { Navigate } from "react-router-dom";
import ChatWindow from "./components/ChatWindow";
import NewConversation from "./pages/NewConversation";

const App = () => {
  const PrivateRoute = ({ children }) => {
    const { user, authLoading } = useAuthContext();

    if (authLoading) {
      return "Loading...";
    }

    if (!user) {
      return <Navigate to="/sign_up" replace />;
    }

    return children;
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/messages"
          element={
            <PrivateRoute>
              <Messages />
            </PrivateRoute>
          }
        />
        <Route
          path="/chat/:conversationId"
          element={
            <PrivateRoute>
              <ChatWindow />
            </PrivateRoute>
          }
        />
        <Route
          path="/new-conversation"
          element={
            <PrivateRoute>
              <NewConversation />
            </PrivateRoute>
          }
        />
        <Route
          path="/projects"
          element={
            <PrivateRoute>
              <Projects />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route path="/sign_up" element={<SignUpLoginPage />} />
        <Route path="/create_account" element={<SignUp />} />
      </Routes>
    </Router>
  );
};

export default App;
