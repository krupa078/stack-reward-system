import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

const QuestionsList = () => {
  const [questions, setQuestions] = useState([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState("");

  const fetchQuestions = async () => {
    try {
      const { data } = await api.get("/api/questions");
      setQuestions(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/api/questions", { title, body });
      setTitle("");
      setBody("");
      fetchQuestions();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create question");
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-title">Questions</h2>
          <p className="page-subtitle">
            Ask and explore questions from the community.
          </p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: "1.25rem" }}>
        <h3 className="card-title" style={{ marginBottom: "0.75rem" }}>
          Ask a Question
        </h3>
        {error && <p style={{ color: "red", fontSize: "0.85rem" }}>{error}</p>}
        <form className="form" onSubmit={handleCreate}>
          <div className="form-row">
            <label className="form-label">Title</label>
            <input
              className="input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="e.g. What is React and how does it work?"
            />
          </div>
          <div className="form-row">
            <label className="form-label">Body</label>
            <textarea
              className="textarea"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
              placeholder="Describe your problem or question in detail."
            />
          </div>
          <button className="btn btn-primary" type="submit">
            Post Question
          </button>
        </form>
      </div>

      <div className="question-list">
        {questions.map((q) => (
          <div key={q._id} className="card">
            <div className="card-header">
              <Link to={`/questions/${q._id}`} className="question-item-title">
                {q.title}
              </Link>
              <div>
                <span className="chip">{q.user?.points ?? 0} pts</span>
                {q.user?.badge && (
                  <span className="badge-chip">{q.user.badge}</span>
                )}
              </div>
            </div>
            <div className="question-item-footer">
              <span>Asked by {q.user?.name || "Unknown"}</span>
              <span>
                {new Date(q.createdAt).toLocaleDateString()}{" "}
                {new Date(q.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        ))}
        {questions.length === 0 && (
          <p className="page-subtitle">
            No questions yet. Be the first to ask something!
          </p>
        )}
      </div>
    </div>
  );
};

export default QuestionsList;
