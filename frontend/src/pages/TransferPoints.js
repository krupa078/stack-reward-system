import React, { useState } from "react";
import api from "../api";
import { useAuth } from "../context/AuthContext";

const TransferPoints = () => {
  const [toEmail, setToEmail] = useState("");
  const [amount, setAmount] = useState(0);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { user, setUser } = useAuth();

  const handleTransfer = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      const { data } = await api.post("/api/points", {
        toEmail,
        amount: Number(amount),
      });
      setMessage(data.message);
      setUser({
        ...user,
        points: data.senderPoints,
        badge: data.senderBadge,
      });
    } catch (err) {
      setError(err.response?.data?.message || "Transfer failed");
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Transfer Points</h2>
          <p className="page-subtitle">
            Reward other helpful users by sending them some of your points.
          </p>
        </div>
      </div>

      <div className="card auth-card">
        <p className="info-text" style={{ marginBottom: "0.5rem" }}>
          You can transfer points only if you have more than{" "}
          <strong>10 points</strong>.
        </p>
        <p className="info-text" style={{ marginBottom: "1rem" }}>
          Your current points: <strong>{user?.points}</strong> • Badge:{" "}
          <span className="badge-chip" style={{ marginLeft: 0 }}>
            {user?.badge}
          </span>
        </p>
        <form className="form" onSubmit={handleTransfer}>
          <div className="form-row">
            <label className="form-label">Receiver Email</label>
            <input
              className="input"
              type="email"
              value={toEmail}
              onChange={(e) => setToEmail(e.target.value)}
              required
              placeholder="user@example.com"
            />
          </div>
          <div className="form-row">
            <label className="form-label">Points to Transfer</label>
            <input
              className="input"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              min="1"
            />
          </div>
          <button className="btn btn-primary" type="submit">
            Transfer
          </button>
        </form>
        {message && (
          <p style={{ color: "green", fontSize: "0.85rem", marginTop: "0.6rem" }}>
            {message}
          </p>
        )}
        {error && (
          <p style={{ color: "red", fontSize: "0.85rem", marginTop: "0.6rem" }}>
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default TransferPoints;
