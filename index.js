require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index.js");

const app = express();

app.use(cors());
app.use(express.json());

const mongoURI = process.env.MONGO_URI;

mongoose
  .connect(mongoURI)
  .then(() => console.log("connected to mongodb!"))
  .catch((err) => console.error("failed to connect to mongodb :(", err));

app.use("/api/v1", mainRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`server is running on port: ${port}...`);
});
