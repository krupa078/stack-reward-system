import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import QuestionsList from "./pages/QuestionsList";
import QuestionDetail from "./pages/QuestionDetail";
import Profile from "./pages/Profile";
import TransferPoints from "./pages/TransferPoints";
import Leaderboard from "./pages/Leaderboard";
import { useAuth } from "./context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <>
      <Navbar />
      <main className="page-container">
        <Routes>
          <Route path="/" element={<Navigate to="/questions" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/questions"
            element={
              <PrivateRoute>
                <QuestionsList />
              </PrivateRoute>
            }
          />
          <Route
            path="/questions/:id"
            element={
              <PrivateRoute>
                <QuestionDetail />
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
          <Route
            path="/transfer"
            element={
              <PrivateRoute>
                <TransferPoints />
              </PrivateRoute>
            }
          />
          <Route
            path="/leaderboard"
            element={
              <PrivateRoute>
                <Leaderboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </main>
    </>
  );
};

export default App;
