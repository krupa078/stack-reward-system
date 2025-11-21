const express = require("express");
const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware");
const { updateUserBadge } = require("../utils/badgeUtils");

const router = express.Router();

/**
 * Transfer points from logged-in user (sender) to another user using email
 * Rules:
 * - Sender must have more than 10 points
 * - Sender must have >= amount
 */
router.post("/", protect, async (req, res) => {
  try {
    const { toEmail, amount } = req.body;
    const pointsToTransfer = Number(amount);

    if (!toEmail || !pointsToTransfer || pointsToTransfer <= 0) {
      return res.status(400).json({ message: "Invalid transfer data" });
    }

    const sender = await User.findById(req.user._id);
    const receiver = await User.findOne({ email: toEmail });

    if (!receiver) {
      return res.status(404).json({ message: "Receiver not found" });
    }

    if (sender._id.toString() === receiver._id.toString()) {
      return res.status(400).json({ message: "Cannot transfer points to yourself" });
    }

    if (sender.points <= 10) {
      return res.status(400).json({ message: "You need more than 10 points to transfer" });
    }

    if (sender.points < pointsToTransfer) {
      return res.status(400).json({ message: "Not enough points to transfer" });
    }

    sender.points -= pointsToTransfer;
    receiver.points += pointsToTransfer;

    await sender.save();
    await receiver.save();

    await updateUserBadge(sender._id);
    await updateUserBadge(receiver._id);

    res.json({
      message: `Transferred ${pointsToTransfer} points to ${receiver.email}`,
      senderPoints: sender.points,
      receiverPoints: receiver.points,
      senderBadge: sender.badge,
      receiverBadge: receiver.badge,
    });
  } catch (error) {
    console.error("Transfer error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
