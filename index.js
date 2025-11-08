const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");

const app = express();

// Connect to DB
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));

// Routes
const userRoutes = require("./routes/users");
const exerciseRoutes = require("./routes/exercises");

app.use("/api/users", userRoutes);
app.use("/api/users", exerciseRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("Exercise Tracker API is running");
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
