const User = require("../models/User");

const getBadgeForPoints = (points) => {
  if (points >= 500) return "Gold";
  if (points >= 200) return "Silver";
  if (points >= 50) return "Bronze";
  return "Newbie";
};

const updateUserBadge = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    const newBadge = getBadgeForPoints(user.points);
    if (newBadge !== user.badge) {
      user.badge = newBadge;
      await user.save();
    }
  } catch (error) {
    console.error("updateUserBadge error:", error.message);
  }
};

module.exports = { getBadgeForPoints, updateUserBadge };
