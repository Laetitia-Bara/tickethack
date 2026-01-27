const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
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
