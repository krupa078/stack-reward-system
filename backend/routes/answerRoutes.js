const express = require("express");
const Answer = require("../models/Answer");
const Question = require("../models/Question");
const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware");
const { updateUserBadge } = require("../utils/badgeUtils");

const router = express.Router();

/**
 * Create answer for a question
 * Reward: +5 points to answer owner
 */
router.post("/:questionId", protect, async (req, res) => {
  try {
    const { content } = req.body;
    const question = await Question.findById(req.params.questionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    const answer = await Answer.create({
      content,
      question: question._id,
      user: req.user._id,
    });

    await User.findByIdAndUpdate(req.user._id, { $inc: { points: 5 } });
    await updateUserBadge(req.user._id);

    res.json({ message: "Answer created, +5 points", answer });
  } catch (error) {
    console.error("Create answer error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * Upvote answer
 * Requirement: when total upvotes on this answer reach 5, give ONE-TIME +5 bonus
 */
router.post("/:id/upvote", protect, async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);
    if (!answer) return res.status(404).json({ message: "Answer not found" });

    // increment upvotes first
    answer.upvotes += 1;
    await answer.save();

    // if this upvote makes it exactly 5, award bonus +5 to the answer author
    if (answer.upvotes === 5) {
      await User.findByIdAndUpdate(answer.user, { $inc: { points: 5 } });
      await updateUserBadge(answer.user);
    }

    res.json({ message: "Upvoted", answer });
  } catch (error) {
    console.error("Upvote error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * Downvote answer
 * Penalty: -5 points to the answer author
 */
router.post("/:id/downvote", protect, async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);
    if (!answer) return res.status(404).json({ message: "Answer not found" });

    answer.downvotes += 1;
    await answer.save();

    await User.findByIdAndUpdate(answer.user, { $inc: { points: -5 } });
    await updateUserBadge(answer.user);

    res.json({ message: "Downvoted, -5 points removed from author", answer });
  } catch (error) {
    console.error("Downvote error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * Delete answer
 * Penalty: -5 points (remove the original reward for posting)
 */
router.delete("/:id", protect, async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);
    if (!answer) return res.status(404).json({ message: "Answer not found" });

    // Only owner (or later admin) can delete
    if (answer.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed to delete this answer" });
    }

    await User.findByIdAndUpdate(answer.user, { $inc: { points: -5 } });
    await updateUserBadge(answer.user);
    await answer.deleteOne();

    res.json({ message: "Answer deleted, -5 points removed" });
  } catch (error) {
    console.error("Delete answer error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
