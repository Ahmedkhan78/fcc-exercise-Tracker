const express = require("express");
const router = express.Router();

const exerciseController = require("../controllers/exerciseController");

router.post("/:id/exercises", exerciseController.addExercise);
router.get("/:id/exercises", exerciseController.getLogs);

module.exports = router;
