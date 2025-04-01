const User = require("../models/User");

const getAllUsers = async (req, res) => {
  const users = await User.find().select("-password").lean();
  if (!users.length) {
    res.status(400).json({ message: "NO users found" });
  }
  res.json(users);
};

module.exports = {
  getAllUsers,
};
