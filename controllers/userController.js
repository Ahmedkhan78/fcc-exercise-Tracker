const User = require("../models/User");

const User = require("../models/User");

exports.createUser = async (req, res) => {
  try {
    const username = req.body.username;
    if (!username) return res.status(400).json({ error: "Username required" });

    const newUser = new User({ username });
    const savedUser = await newUser.save();

    res.json({
      username: savedUser.username,
      _id: savedUser._id,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "username _id");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
