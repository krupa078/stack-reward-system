import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-title">
        <span className="logo-dot" />
        <Link to="/questions">Stack Reward System</Link>
      </div>
      <div className="navbar-links">
        {user ? (
          <>
            <span className="navbar-user">
              Hi, {user.name} | Points: <strong>{user.points}</strong>
              {user.badge && (
                <span className="badge-chip" style={{ marginLeft: "6px" }}>
                  {user.badge}
                </span>
              )}
            </span>
            <Link to="/questions">Questions</Link>
            <Link to="/leaderboard">Leaderboard</Link>
            <Link to="/transfer">Transfer Points</Link>
            <Link to="/profile">Profile</Link>
            <button className="btn btn-small btn-outline" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <button
              className="btn btn-small btn-primary"
              onClick={() => navigate("/register")}
            >
              Get Started
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
