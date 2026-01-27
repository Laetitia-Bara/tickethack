const express = require("express");
const moment = require("moment");
const router = express.Router();
const Trip = require("../models/trips");

//GET /trips
router.get("/", async (req, res) => {
  try {
    const { departure, arrival, date } = req.query;

    if (!departure || !arrival || !date) {
      return res.json({ result: false, error: "Paramètre(s) manquant(s)" });
    }

    const start = moment(date, "YYYY-MM-DD").startOf("day").toDate();
    const end = moment(date, "YYYY-MM-DD").endOf("day").toDate();

    const trips = await Trip.find({
      departure: new RegExp(`^${departure}$`, "i"),
      arrival: new RegExp(`^${arrival}$`, "i"),
      date: { $gte: start, $lte: end },
    }).sort({ date: 1 });

    res.json({ result: true, trips });
  } catch (err) {
    console.error(err);
    res.json({ result: false, error: "Erreur serveur" });
  }
});

module.exports = router;
