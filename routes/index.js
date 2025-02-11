const express = require("express");

const userRouter = require("./users.js");
const taskRouter = require("./tasks.js");

const router = express.Router();

router.use("/user", userRouter);
router.use("/tasks", taskRouter);

module.exports = router;
