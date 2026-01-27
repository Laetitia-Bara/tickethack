const express = require("express");
const router = express.Router();
const moment = require("moment");

const Booking = require("../models/bookings");
const Trip = require("../models/trips");

// POST /bookings
router.post("/", async (req, res) => {
  try {
    const { tripIds } = req.body;

    if (!Array.isArray(tripIds) || tripIds.length === 0) {
      return res.status(400).json({
        result: false,
        error: "tripIds non trouvé",
      });
    }

    const trips = await Trip.find({ _id: { $in: tripIds } });

    if (trips.length === 0) {
      return res.status(404).json({
        result: false,
        error: "Pas de voyage(s) trouvé(s) pour cet Id",
      });
    }

    const bookings = trips.map((trip) => ({
      trip: {
        departure: trip.departure,
        arrival: trip.arrival,
        date: trip.date,
        price: trip.price,
      },
    }));

    await Booking.insertMany(bookings);

    return res.json({ result: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ result: false, error: "Erreur Serveur" });
  }
});

// GET /bookings
router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });

    const bookingsWithWaiting = bookings.map((b) => {
      const departureMoment = moment(b.trip.date);
      const now = moment();

      // diff en minutes (arrondi)
      const diffMinutes = departureMoment.diff(now, "minutes");

      let waitingTime;
      if (diffMinutes <= 0) {
        waitingTime = "Parti";
      } else if (diffMinutes < 60) {
        waitingTime = `Départ dans ${diffMinutes} minute(s)`;
      } else {
        const hours = Math.floor(diffMinutes / 60);
        waitingTime = `Départ dans ${hours} heure(s)`;
      }

      const time = departureMoment.format("HH:mm");

      // Ajouter waitingTime à un doc mongoose
      return {
        ...b.toObject(),
        waitingTime,
        time,
      };
    });

    return res.json({ result: true, bookings: bookingsWithWaiting });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ result: false, error: "Erreur serveur" });
  }
});

module.exports = router;
