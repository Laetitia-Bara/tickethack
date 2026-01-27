const express = require("express");
const router = express.Router();
const Trip = require("../models/trips");

//GET /trips
router.get("/", async (req, res) => {
  const { departure, arrival, date } = req.query;

  if (!departure || !arrival || !date) {
    return res.json({ result: false, error: "Paramètre(s) manquant(s)" });
  }

  const start = new Date(date);
  start.setHours(0, 0, 0, 0);

  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  const trips = await Trip.find({
    departure: new RegExp(`^${departure}$`, "i"),
    arrival: new RegExp(`^${arrival}$`, "i"),
    date: { $gte: start, $lte: end },
  });

  res.json({ result: true, trips });
});

module.exports = router;
