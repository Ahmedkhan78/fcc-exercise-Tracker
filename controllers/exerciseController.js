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

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Build query
    const query = { userId };
    if (from || to) query.date = {};
    if (from) query.date.$gte = new Date(from);
    if (to) query.date.$lte = new Date(to);

    let exercises = Exercise.find(query).select("description duration date");
    if (limit) exercises = exercises.limit(Number(limit));

    const results = await exercises.exec();

    // ✅ Force every field into correct type (FCC strict check)
    const log = results.map((e) => ({
      description: String(e.description),
      duration: Number(e.duration),
      date: new Date(e.date).toDateString(),
    }));

    res.json({
      _id: user._id.toString(),
      username: String(user.username),
      count: log.length,
      log,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
