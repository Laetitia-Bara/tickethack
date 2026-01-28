// models/bookings.js

const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  user: { type: String, required: true },
  trip: {
    departure: String,
    arrival: String,
    date: Date,
    price: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Booking = mongoose.model("bookings", bookingSchema);
module.exports = Booking;
