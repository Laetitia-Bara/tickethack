const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongoServer;
let app;

const Trip = require("../models/trips");
const Booking = require("../models/bookings");

beforeAll(async () => {
  // Démarre Mongo en mémoire
  mongoServer = await MongoMemoryServer.create();
  process.env.MONGO_URI = mongoServer.getUri();
  app = require("../app");

  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(process.env.MONGO_URI);
  }
});

afterEach(async () => {
  // Nettoyage entre tests
  await Trip.deleteMany({});
  await Booking.deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Bookings API", () => {
  test("POST /bookings création des bookings", async () => {
    // On crée 2 trips en base
    const [t1, t2] = await Trip.insertMany([
      {
        departure: "Paris",
        arrival: "Lyon",
        date: new Date("2026-01-27T10:00:00Z"),
        price: 38,
      },
      {
        departure: "Paris",
        arrival: "Lyon",
        date: new Date("2026-01-27T12:00:00Z"),
        price: 60,
      },
    ]);

    const res = await request(app)
      .post("/bookings")
      .send({ tripIds: [String(t1._id), String(t2._id)] })
      .set("Content-Type", "application/json");

    expect(res.statusCode).toBe(200);
    expect(res.body.result).toBe(true);

    const count = await Booking.countDocuments();
    expect(count).toBe(2);
  });

  test("POST /bookings retourne erreur 400 si tripId missing/empty", async () => {
    const res = await request(app)
      .post("/bookings")
      .send({ tripIds: [] })
      .set("Content-Type", "application/json");

    expect(res.statusCode).toBe(400);
    expect(res.body.result).toBe(false);
  });

  test("GET /bookings doit retourner tous les bookings", async () => {
    // On crée 1 booking
    await Booking.create({
      trip: {
        departure: "Paris",
        arrival: "Lyon",
        date: new Date("2026-01-27T10:00:00Z"),
        price: 38,
      },
    });

    const res = await request(app).get("/bookings");

    expect(res.statusCode).toBe(200);
    expect(res.body.result).toBe(true);
    expect(Array.isArray(res.body.bookings)).toBe(true);
    expect(res.body.bookings.length).toBe(1);
    expect(res.body.bookings[0].trip.departure).toBe("Paris");
  });
});
