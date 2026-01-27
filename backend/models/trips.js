// models/trips.js

const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema({
  departure: { type: String, required: true },
  arrival: { type: String, required: true },
  date: { type: Date, required: true },
  price: { type: Number, required: true },
});

tripSchema.index({ departure: 1, arrival: 1, date: 1 });

const Trip = mongoose.model("trips", tripSchema);
module.exports = Trip;
