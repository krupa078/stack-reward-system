import React, { useEffect, useState } from "react";
import api from "../api";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const fetchMe = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/api/users/me");
      setUser(data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMe();
    // eslint-disable-next-line
  }, []);

  if (!user) return <p>No user</p>;

  return (
    <div className="card auth-card">
      <h2 className="page-title" style={{ marginBottom: "0.5rem" }}>
        My Profile
      </h2>
      {loading && <p className="page-subtitle">Refreshing...</p>}
      <p>
        <strong>Name:</strong> {user.name}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <p>
        <strong>Points:</strong> {user.points}
      </p>
      <p>
        <strong>Badge:</strong>{" "}
        <span className="badge-chip" style={{ marginLeft: 0 }}>
          {user.badge}
        </span>
      </p>
      <p className="info-text">
        Your badge changes automatically when your points grow.
      </p>
      <button className="btn btn-outline" onClick={fetchMe}>
        Refresh
      </button>
    </div>
  );
};

export default Profile;
