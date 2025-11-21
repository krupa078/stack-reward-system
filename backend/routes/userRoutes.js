const express = require("express");
const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Get current user profile
router.get("/me", protect, async (req, res) => {
  res.json(req.user);
});

// Get leaderboard - top users by points
router.get("/leaderboard", protect, async (req, res) => {
  try {
    const users = await User.find({})
      .select("name email points badge createdAt")
      .sort({ points: -1, createdAt: 1 })
      .limit(20);

    res.json(users);
  } catch (error) {
    console.error("Leaderboard error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
