const mongoose = require("mongoose");

//user schema

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    minLength: 3,
    maxLength: 30,
    trim: true,
  },

  firstname: {
    type: String,
    required: true,
    trim: true,
    maxLength: 30,
  },

  lastname: {
    type: String,
    required: true,
    trim: true,
    maxLength: 30,
  },

  password: {
    type: String,
    required: true,
    trim: true,
    maxLength: 30,
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
