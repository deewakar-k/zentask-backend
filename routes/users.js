const express = require("express");

const router = express.Router();

const zod = require("zod");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config.js");
const User = require("../schema/user.js");

const signupBody = zod.object({
  username: zod.string(),
  firstname: zod.string(),
  lastname: zod.string(),
  password: zod.string(),
});

router.post("/signup", async (req, res) => {
  const { success } = signupBody.safeParse(req.body);
  if (!success) {
    return res.status(411).json({
      message: "username/email already taken or invalid inputs",
    });
  }

  const existingUser = await User.findOne({
    username: req.body.username,
  });

  if (existingUser) {
    return res.status(411).json({
      message: "username already taken / user already exists",
    });
  }

  const user = await User.create({
    username: req.body.username,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    password: req.body.password,
  });

  const userId = user._id;

  const token = jwt.sign(
    {
      userId,
    },
    JWT_SECRET,
  );

  res.status(200).json({
    message: "user created successfully",
    token: token,
  });
});

const signinBody = zod.object({
  username: zod.string(),
  password: zod.string(),
});

router.post("/signin", async (req, res) => {
  const validatedResult = signinBody.safeParse(req.body);

  if (!validatedResult.success) {
    return res.status(411).json({
      message: "incorrent inputs!",
    });
  }

  //signin logic
  const { username, password } = validatedResult.data;
  const user = await User.findOne({
    username,
    password,
  });

  if (user) {
    const token = jwt.sign(
      {
        userId: user._id,
      },
      JWT_SECRET,
    );

    res.json({
      token: token,
    });
    return;
  }

  res.status(411).json({
    message: "error while logging in",
  });
});

module.exports = router;
