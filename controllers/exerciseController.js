const User = require("../models/User");
const Exercise = require("../models/Exercise");

exports.addExercise = async (req, res) => {
  try {
    const { description, duration, date } = req.body;
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const exercise = new Exercise({
      userId,
      description,
      duration: Number(duration),
      date: date ? new Date(date) : new Date(),
    });

    const savedExercise = await exercise.save();

    res.json({
      _id: user._id,
      username: user.username,
      date: savedExercise.date.toDateString(),
      duration: savedExercise.duration,
      description: savedExercise.description,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getLogs = async (req, res) => {
  try {
    const { from, to, limit } = req.query;
    const userId = req.params.id;

    const user = await User.findById(userId).lean();
    if (!user) return res.status(404).json({ error: "User not found" });

    const query = { userId };
    if (from || to) query.date = {};
    if (from) query.date.$gte = new Date(from);
    if (to) query.date.$lte = new Date(to);

    let exercises = Exercise.find(query).lean(); // << make sure to use lean()
    if (limit) exercises = exercises.limit(Number(limit));

    const results = await exercises.exec();

    const log = results.map((e) => {
      const d = new Date(e.date);
      const dateStr = isNaN(d.getTime()) ? "" : d.toDateString();
      return {
        description: String(e.description),
        duration: Number(e.duration),
        date: dateStr,
      };
    });

    res.json({
      _id: String(user._id),
      username: String(user.username),
      count: log.length,
      log,
    });
  } catch (err) {
    console.error("getLogs error:", err);
    res.status(500).json({ error: err.message });
  }
};
