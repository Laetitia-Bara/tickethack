const express = require("express");
const router = express.Router();
const Booking = require("../models/bookings");
const Trip = require("../models/trips");

//POST /bookings
router.post("/", async (req, res) => {
  const { tripIds } = req.body;

  const trips = await Trip.find({ _id: { $in: tripIds } });

  const bookings = trips.map((trip) => ({
    trip: {
      departure: trip.departure,
      arrival: trip.arrival,
      date: trip.date,
      price: trip.price,
    },
  }));

  await Booking.insertMany(bookings);

  res.json({ result: true });
});

//GET /bookings
router.get("/", async (req, res) => {
  const bookings = await Booking.find();
  res.json({ result: true, bookings });
});

module.exports = router;
