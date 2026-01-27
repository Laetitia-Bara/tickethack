require("dotenv").config();
require("./models/connection");

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const indexRouter = require("./routes/index");
const tripsRouter = require("./routes/trips");
const bookingsRouter = require("./routes/bookings");

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected, Youhouuuuu !!!"))
  .catch((err) => console.error(err));

app.use("/", indexRouter);
app.use("/trips", tripsRouter);
app.use("/bookings", bookingsRouter);

module.exports = app;
