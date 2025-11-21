import React, { useEffect, useState } from "react";
import api from "../api";

const Leaderboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/api/users/leaderboard");
      setUsers(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const getRankClass = (index) => {
    if (index === 0) return "rank-badge rank-1";
    if (index === 1) return "rank-badge rank-2";
    if (index === 2) return "rank-badge rank-3";
    return "rank-badge";
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Leaderboard</h2>
          <p className="page-subtitle">
            Top users ranked by total points & badges.
          </p>
        </div>
      </div>

      <div className="card">
        {loading ? (
          <p>Loading leaderboard...</p>
        ) : users.length === 0 ? (
          <p>No users yet. Start by posting a question or answer.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>User</th>
                <th>Email</th>
                <th>Points</th>
                <th>Badge</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, index) => (
                <tr key={u._id}>
                  <td>
                    <span className={getRankClass(index)}>#{index + 1}</span>
                  </td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.points}</td>
                  <td>
                    <span className="badge-chip" style={{ marginLeft: 0 }}>
                      {u.badge}
                    </span>
                  </td>
                  <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
