const express = require("express");
const zod = require("zod");

const Task = require("../schema/task.js");
const authMiddleware = require("../middleware.js");

const router = express.Router();

const taskBody = zod.object({
  title: zod.string(),
});

router.post("/", authMiddleware, async (req, res) => {
  const validatedResult = taskBody.safeParse(req.body);

  if (!validatedResult.success) {
    return res.status(411).json({
      message: "invalid inputs",
    });
  }

  const { title } = validatedResult.data;

  const task = await Task.create({
    title,
    userId: req.userId,
  });

  if (!task) {
    return res.status(411).json({
      message: "error creating task",
    });
  }

  res.status(200).json({
    message: "task created",
  });
});

router.get("/", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.userId });

    res.status(200).json({
      message: "successfull shown tasks",
      tasks: tasks,
    });
  } catch (err) {
    res.status(500).json({
      message: "error fetching tasks",
      error: err,
    });
  }
});

const updateBody = zod.object({
  _id: zod.string(),
  completion: zod.boolean(),
});

router.put("/", authMiddleware, async (req, res) => {
  try {
    //updating completion
    const validatedResult = updateBody.safeParse(req.body);

    if (!validatedResult.success) {
      return res.status(411).json({
        message: "invalid inputs",
      });
    }

    const { _id, completion } = validatedResult.data;

    const updatedTask = await Task.findOneAndUpdate(
      { _id: _id, userId: req.userId },
      {
        completion: completion,
        updatedAt: new Date(),
      },
      { new: true },
    );

    if (updatedTask) {
      return res.status(200).json({
        message: "task updated",
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "error updating",
      error: err,
    });
  }
});

router.delete("/", authMiddleware, async (req, res) => {
  try {
    const _id = req.body;
    const deletedTask = await Task.findOneAndDelete({
      _id: _id,
      userId: req.userId,
    });

    if (deletedTask) {
      return res.status(200).json({
        message: "task deleted",
      });
    }

    res.status(404).json({
      message: "task not found",
    });
  } catch (err) {
    res.status(500).json({
      error: err,
    });
  }
});

module.exports = router;
