const express = require("express");
const Question = require("../models/Question");
const Answer = require("../models/Answer");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Get all questions
router.get("/", async (req, res) => {
  try {
    const questions = await Question.find()
      .populate("user", "name email points badge")
      .sort({ createdAt: -1 });
    res.json(questions);
  } catch (error) {
    console.error("Get questions error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Create question
router.post("/", protect, async (req, res) => {
  try {
    const { title, body } = req.body;
    const question = await Question.create({
      title,
      body,
      user: req.user._id,
    });
    res.json(question);
  } catch (error) {
    console.error("Create question error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Get single question + answers
router.get("/:id", async (req, res) => {
  try {
    const question = await Question.findById(req.params.id).populate(
      "user",
      "name email points badge"
    );
    if (!question)
      return res.status(404).json({ message: "Question not found" });

    const answers = await Answer.find({ question: question._id })
      .populate("user", "name email points badge")
      .sort({ createdAt: -1 });

    res.json({ question, answers });
  } catch (error) {
    console.error("Get question error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
