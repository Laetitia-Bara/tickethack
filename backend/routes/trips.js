const express = require("express");
const moment = require("moment");
const router = express.Router();
const Trip = require("../models/trips");

function escapeRegex(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

//GET /trips
router.get("/", async (req, res) => {
  try {
    const { departure, arrival, date } = req.query;

    if (!departure || !arrival || !date) {
      return res.json({ result: false, error: "Paramètre(s) manquant(s)" });
    }

    const day = moment.utc(date, "YYYY-MM-DD", true);
    if (!day.isValid()) {
      return res.json({ result: false, error: "Date invalide" });
    }

    const start = day.startOf("day").toDate();
    const end = day.endOf("day").toDate();

    const trips = await Trip.find({
      departure: new RegExp(`^${escapeRegex(departure)}$`, "i"),
      arrival: new RegExp(`^${escapeRegex(arrival)}$`, "i"),
      date: { $gte: start, $lte: end },
    }).sort({ date: 1 });

    res.json({ result: true, trips });
  } catch (err) {
    console.error(err);
    res.json({ result: false, error: "Erreur serveur" });
  }
});

module.exports = router;
