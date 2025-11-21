import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await api.post("/api/auth/login", { email, password });
      login(data);
      navigate("/questions");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-card card">
      <h2 className="page-title" style={{ marginBottom: "0.5rem" }}>
        Welcome back
      </h2>
      <p className="page-subtitle" style={{ marginBottom: "1rem" }}>
        Login to continue asking and answering questions.
      </p>
      {error && <p style={{ color: "red", fontSize: "0.85rem" }}>{error}</p>}
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-row">
          <label className="form-label">Email</label>
          <input
            className="input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-row">
          <label className="form-label">Password</label>
          <input
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button className="btn btn-primary" type="submit">
          Login
        </button>
      </form>
      <p style={{ marginTop: "0.75rem", fontSize: "0.85rem" }}>
        New here? <Link to="/register">Create an account</Link>
      </p>
    </div>
  );
};

export default Login;
