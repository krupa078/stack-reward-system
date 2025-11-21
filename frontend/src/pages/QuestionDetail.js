import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/AuthContext";

const QuestionDetail = () => {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const { user, setUser } = useAuth();

  const fetchQuestion = async () => {
    try {
      const { data } = await api.get(`/api/questions/${id}`);
      setQuestion(data.question);
      setAnswers(data.answers);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchQuestion();
    // eslint-disable-next-line
  }, [id]);

  const refreshMe = async () => {
    try {
      const { data } = await api.get("/api/users/me");
      setUser(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateAnswer = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await api.post(`/api/answers/${id}`, { content });
      setContent("");
      setAnswers((prev) => [data.answer, ...prev]);
      await refreshMe(); // keeps points & badge in sync
    } catch (err) {
      setError(err.response?.data?.message || "Failed to post answer");
    }
  };

  const handleVote = async (answerId, type) => {
    try {
      // ensure auth header is always set for this request
      const stored = localStorage.getItem("user");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.token) {
          api.defaults.headers.common["Authorization"] = `Bearer ${parsed.token}`;
        }
      }

      const endpoint =
        type === "up"
          ? `/api/answers/${answerId}/upvote`
          : `/api/answers/${answerId}/downvote`;
      const { data } = await api.post(endpoint);
      setAnswers((prev) =>
        prev.map((a) => (a._id === answerId ? { ...a, ...data.answer } : a))
      );
      // points or badge might change on upvote/downvote, so refresh current user
      await refreshMe();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (answerId) => {
    try {
      await api.delete(`/api/answers/${answerId}`);
      setAnswers((prev) => prev.filter((a) => a._id !== answerId));
      await refreshMe();
    } catch (err) {
      console.error(err);
    }
  };

  if (!question) return <p>Loading...</p>;

  return (
    <div>
      <div className="card" style={{ marginBottom: "1.25rem" }}>
        <h2 className="page-title" style={{ marginBottom: "0.35rem" }}>
          {question.title}
        </h2>
        <p style={{ marginBottom: "0.5rem" }}>{question.body}</p>
        <p className="card-meta">
          Asked by {question.user?.name} • Points: {question.user?.points} •{" "}
          Badge: {question.user?.badge}
        </p>
      </div>

      <div className="card" style={{ marginBottom: "1.25rem" }}>
        <h3 className="card-title" style={{ marginBottom: "0.75rem" }}>
          Your Answer
        </h3>
        {error && <p style={{ color: "red", fontSize: "0.85rem" }}>{error}</p>}
        <form className="form" onSubmit={handleCreateAnswer}>
          <div className="form-row">
            <textarea
              className="textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              placeholder="Write a clear and helpful answer..."
            />
          </div>
        <button className="btn btn-primary" type="submit">
            Post Answer (+5 points)
          </button>
        </form>
      </div>

      <div>
        <h3 className="page-title" style={{ fontSize: "1.15rem" }}>
          Answers
        </h3>
        {answers.length === 0 && (
          <p className="page-subtitle">No answers yet. Be the first!</p>
        )}
        {answers.map((a) => (
          <div key={a._id} className="card answer-card">
            <p>{a.content}</p>
            <p className="answer-meta">
              By {a.user?.name} • Their points: {a.user?.points} • Badge:{" "}
              {a.user?.badge} • Upvotes: {a.upvotes} • Downvotes:{" "}
              {a.downvotes}
            </p>
            <div className="answer-actions">
              <button
                className="btn btn-small btn-outline"
                onClick={() => handleVote(a._id, "up")}
              >
                Upvote
              </button>
              <button
                className="btn btn-small btn-outline"
                onClick={() => handleVote(a._id, "down")}
              >
                Downvote (-5)
              </button>
              {user && user._id === a.user?._id && (
                <button
                  className="btn btn-small btn-danger"
                  onClick={() => handleDelete(a._id)}
                >
                  Delete Answer (-5)
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionDetail;
